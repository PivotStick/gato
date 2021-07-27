const { Router } = require("express")
const fs = require("fs")
const { join } = require("path")
const { getMiddlewares } = require("./getMiddlewares")
const { resolveSchema } = require("./resolveSchema")

let prefix = null
let router = null

const addMethod = (method, controllers) => {
    if (prefix === null) return

    for (let { controller, middlewares, path, checkRights } of resolveSchema(
        prefix,
        controllers
    )) {
        middlewares = middlewares.filter((m) =>
            global.paths._middlewares.regex.test(m.slice(1))
        )
        const m = getMiddlewares(middlewares, global.paths._middlewares.path)
        router[method](path, checkRights, ...m, controller)
    }
}

globalThis.$$ = {
    set get(controllers) {
        addMethod("get", controllers)
    },
    set post(controllers) {
        addMethod("post", controllers)
    },
    set patch(controllers) {
        addMethod("patch", controllers)
    },
    set put(controllers) {
        addMethod("put", controllers)
    },
    set delete(controllers) {
        addMethod("delete", controllers)
    },
}

/**
 * @param {import("express").Express} app
 */
exports.useRouters = (app) => {
    const { _routes } = global.paths

    const dir = fs.readdirSync(_routes.path).filter(filter(_routes))
    for (const file of dir) {
        prefix = "/" + file.replace(/.\w+$/, "")
        router = Router()
        require(join(_routes.path, file))

        app.use(prefix, router)
    }

    prefix = null
}

/**
 * @param {FullPath} args
 * @returns {(value: string) => boolean}
 */
const filter =
    ({ path, regex }) =>
    (file) =>
        fs.statSync(join(path, file)).isFile() && regex.test(file)
