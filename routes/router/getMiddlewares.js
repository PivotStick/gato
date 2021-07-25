const { join } = require("path")

/**
 * @param {string} path
 * @param {string} name
 * @returns {import("express").RequestHandler}
 */
const getMiddleware = (path, name) => {
    path = join(path, name.replace(/^@/, ""))
    return require(path)
}

/**
 * @param {string[]} middlewares
 * @param {string} path
 */
exports.getMiddlewares = (middlewares, path) =>
    middlewares.map((middleware) => getMiddleware(path, middleware))
