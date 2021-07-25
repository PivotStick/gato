const fs = require("fs")
const { join } = require("path")
const { createRouter } = require("./createRouter")

/**
 * @param {import("express").Express} app
 */
exports.useRouters = (app) => {
    const { _routes } = global.paths

    const dir = fs.readdirSync(_routes.path).filter(filter(_routes))
    for (const file of dir) {
        const methods = require(join(_routes.path, file))

        const prefix = "/" + file.replace(/.\w+$/, "")
        const router = createRouter(methods, prefix.slice(1))

        app.use(prefix, router)
    }
}

/**
 * @param {FullPath} args
 * @returns {(value: string) => boolean}
 */
const filter =
    ({ path, regex }) =>
    (file) =>
        fs.statSync(join(path, file)).isFile() && regex.test(file)
