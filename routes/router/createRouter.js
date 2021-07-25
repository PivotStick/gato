const { Router } = require("express")
const { getMiddlewares } = require("./getMiddlewares")
const { resolveSchema } = require("./resolveSchema")

/**
 * @typedef {"get" | "put" | "patch" | "delete" | "post"} Method
 * @param {import("../../@types").Method} method
 * @param {string} prefix
 */
exports.createRouter = (method, prefix) => {
    const router = Router()
    const { _middlewares } = global.paths

    /**
     * @param {Method} method
     * @param {import("./resolveSchema").Schema} param1
     */
    const appendMethod = (
        method,
        { controller, middlewares, path, checkRights }
    ) => {
        middlewares = middlewares.filter((m) =>
            _middlewares.regex.test(m.slice(1))
        )
        const m = getMiddlewares(middlewares, _middlewares.path)
        router[method](path, checkRights, ...m, controller)
    }

    const allowedMethods = ["get", "put", "patch", "delete", "post"]
    for (const method in methods) {
        if (!allowedMethods.includes(method)) continue
        const schema = methods[method]
        const controllers = resolveSchema(prefix, schema)

        for (const data of controllers) appendMethod(method, data)
    }

    return router
}
