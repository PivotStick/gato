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
        const [path, name] = key.split(/\s+/g)
        const endpoint = `^/${currentBase}/${path}/?$`
          .replace(/\/+/g, "\\/")
          .replace(/:([^\\/]+)/g, "(?<$1>[^/]+)")

        map.set(new RegExp(endpoint, "i"), {
          controller: schema[key],
          actionName: name?.startsWith("#") ? name.slice(1) : undefined,
          base: currentBase,
        })
      })
    },
  })
})

/**
 * @type {Record<typeof methods[number], Map<RegExp, {
 *    controller: import("./@types").Controller
 *    actionName: string;
 *    base: string
 * }>>}
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
