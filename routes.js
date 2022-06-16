const { readdirSync, readFileSync } = require("fs")
const { join } = require("path")
const { parse } = require("comment-parser")

const methods = /** @type {const} */ (["get", "post", "put", "patch", "delete"])

let currentBase = ""

/**
 * @type {Record<typeof methods[number], import("./@types/Schema").Schema>}
 */
globalThis.$$ = {}

methods.forEach((method) => {
  Object.defineProperty(globalThis.$$, method, {
    set: (schema) => {
      /** @type {Map} */
      const map = (exports.routes[method] = exports.routes[method] || [])

      Object.keys(schema).forEach((key) => {
        const [path, name] = key.split(/\s+/g)
        const raw = `/${currentBase}/${path}/`
          .replace(/\/+/g, "/")
          .replace(/\/$/, "")

        const endpoint = `^/${currentBase}/${path}/?$`
          .replace(/\/+/g, "\\/")
          .replace(/:([^\\/]+)/g, "(?<$1>[^/]+)")

        map.push([
          new RegExp(endpoint, "i"),
          {
            raw,
            controller: schema[key],
            actionName: name?.startsWith("#") ? name.slice(1) : undefined,
            base: currentBase,
          },
        ])
      })
    },
  })
})

/**
 * @type {Record<typeof methods[number], [RegExp, {
 *    controller: import("./@types").Controller
 *    actionName: string;
 *    base: string
 * }][]>}
 */
exports.routes = {}

exports.routesPath = null

exports.generateRoutes = function (path) {
  exports.routesPath = path
  const routes = readdirSync(path)
  for (const route of routes) {
    if (!route.endsWith(".js")) continue
    currentBase = route.replace(/\.\w+$/, "")
    const fullPath = join(path, route)
    require(fullPath)
  }

  currentBase = ""
}
