const { readdirSync } = require("fs")
const { join } = require("path")

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
      const map = (exports.routes[method] = exports.routes[method] || new Map())

      Object.keys(schema).forEach((key) => {
        const endpoint = `^/${currentBase}/${key}/?$`
          .replace(/\/+/g, "\\/")
          .replace(/:([^\\/]+)/g, "(?<$1>[^/]+)")

        map.set(new RegExp(endpoint, "i"), schema[key])
      })
    },
  })
})

/**
 * @type {Record<typeof methods[number], Map<RegExp, import("./@types/Controller").Controller>>}
 */
exports.routes = {}

exports.generateRoutes = function (path) {
  const routes = readdirSync(path)
  for (const route of routes) {
    if (!route.endsWith(".js")) continue
    currentBase = route.replace(/\.\w+$/, "")
    require(join(path, route))
  }

  currentBase = ""
}
