const { join } = require("path")
const { connect } = require("classy-mongo")
const { readFile } = require("fs").promises
const { lookup } = require("mime-types")
const uploadDir = require("./uploadDir")

const http = require("http")
const { generateRoutes, routes } = require("./routes")
const { getUserModel, getUser } = require("./getUser")
const Body = require("./Body")
const { hasRights, roles, profiles } = require("./functions/hasRights")

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

      const url = new URL(request.url, `http://${request.headers.host}`)
      const match = /^\/(.*\.\w+)\/?$/.exec(url.pathname)

      /** @type {typeof routes["get"]} */
      const controllers = routes[request.method.toLowerCase()] || new Map()
      const headers = new Map(Object.entries(response.getHeaders()))

      headers.set("Content-Type", "application/json")

      let res
      let body = ""

      request
        .on("data", (chunk) => (body += chunk))
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
            try {
              body = JSON.parse(body) || {}
            } catch (error) {}

            for (const [regex, route] of controllers.entries()) {
              const match = regex.exec(url.pathname)
              if (!match) continue

              try {
                Object.setPrototypeOf(body, Body.prototype)
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
                    body,
                    params: { ...(match.groups || {}) },
                    query: url.searchParams,
                    user,
                  }),
                }
              } catch (error) {
                response.statusCode = error.status || 500
                res = {
                  error: {
                    message: error.message,
                    stack: error.stack,
                    ...error,
                  },
                }
              } finally {
                break
              }
            }
          }

          if (!res) {
            response.statusCode = 404
            res = {
              error: {
                message: "Not Found",
              },
            }
          }

          if (res.error) {
            headers.set("Content-Type", "application/json")
          }

          headers.forEach((value, key) => response.setHeader(key, value))
          response.end(
            response.getHeader("Content-Type") === "application/json"
              ? JSON.stringify(res)
              : res.result
          )
        })
    })

    await connect(mongoUri)
    server.listen(port, resolve)
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

  listen,
}
