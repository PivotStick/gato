const { join } = require("path")
const { connect } = require("classy-mongo")
const { readFile } = require("fs").promises
const { lookup } = require("mime-types")
const uploadDir = require("./uploadDir")
const debug = require("./debug")

const http = require("http")
const { generateRoutes, routes } = require("./routes")
const { getUserModel, getUser } = require("./getUser")
const Body = require("./Body")
const { hasRights, roles, profiles } = require("./functions/hasRights")
const { RouteNotFound, ApiError, UnknownError } = require("./errors")
const { getCircularRemover } = require("./functions/getCircularRemover")
const { parseBody } = require("./functions/parseBody")

let clear = false

const listen = (port = 8080, mongoUri = "mongodb://localhost:27017/gatos") =>
  new Promise(async (resolve, reject) => {
    const server = http.createServer(async (request, response) => {
      response.setHeader("Access-Control-Allow-Origin", "*")
      response.setHeader("Access-Control-Allow-Methods", "*")
      response.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization"
      )

      if (request.method === "OPTIONS") {
        response.end()
        return
      }

      debug.log(
        `\n\x1b[2m\x1b[1m${request.method.toUpperCase()}\x1b[0m\x1b[2m ${
          request.url
        }\x1b[0m`
      )

      const url = new URL(request.url, `http://${request.headers.host}`)
      const match = /^\/(.*\.\w+)\/?$/.exec(url.pathname)

      /** @type {typeof routes["get"]} */
      const controllers = routes[request.method.toLowerCase()] || new Map()
      const headers = new Map(Object.entries(response.getHeaders()))

      headers.set("Content-Type", "application/json")

      /**
       * @type {{
       *  error?: ApiError
       *  result?: any
       * }}
       */
      let res
      let data = ""

      request
        .on("data", (chunk) => (data += chunk))
        .on("end", async () => {
          if (match) {
            const fileName = match[1]
            try {
              const file = await readFile(join(uploadDir.value, fileName))

              headers.set("Content-Type", lookup(fileName))
              res = { result: file }
            } catch (error) {
              res = { error }
            }
          } else {
            request.body = {}
            request.files = {}

            parseBody(request, data)

            for (const [regex, route] of controllers.entries()) {
              const match = regex.exec(url.pathname)
              if (!match) continue

              try {
                Object.setPrototypeOf(request.body, Body.prototype)
                const user = await getUser(request)

                hasRights(user.profiles, route.base, route.actionName)

                res = {
                  result: await route.controller({
                    $: {
                      set status(code) {
                        response.statusCode = code
                      },

                      get status() {
                        return response.statusCode
                      },

                      headers,
                    },
                    body: request.body,
                    files: request.files,
                    params: { ...(match.groups || {}) },
                    query: url.searchParams,
                    user,
                  }),
                }
              } catch (error) {
                if (!(error instanceof ApiError)) {
                  error = new UnknownError(error)
                }
                res = { error }
              } finally {
                break
              }
            }
          }

          if (!res) {
            res = { error: new RouteNotFound() }
          }

          if (res.error) {
            headers.set("Content-Type", "application/json")
            response.statusCode = res.error.status || 500
          }

          headers.forEach((value, key) => response.setHeader(key, value))
          response.end(
            response.getHeader("Content-Type") === "application/json"
              ? JSON.stringify(res, getCircularRemover())
              : res.result
          )
        })
    })

    if (clear) debug.clear()
    await connect(mongoUri)
    debug.log("\n\x1b[1m\x1b[32m\x1b[3m✓ Connected to MongoDB\x1b[0m")
    server.listen(port, () => {
      debug.log(`@ \x1b[4m\x1b[3mhttp://locahost:${port}\x1b[0m`)
      resolve()
    })
  })

module.exports = {
  /**
   * @param {string} path
   */
  set routes(path) {
    generateRoutes(join(require.main.path, path))
  },

  /**
   * @param {string} path
   */
  set models(path) {
    getUserModel(join(require.main.path, path))
  },

  /**
   * @param {string} path
   */
  set uploadDir(path) {
    require("./uploadDir").value = join(require.main.path, path)
  },

  roles,
  profiles,

  get clear() {
    clear = true
    return this
  },

  crypto: require("./crypto"),

  listen,
}
