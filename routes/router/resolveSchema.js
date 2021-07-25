const { checkRights } = require("../../middlewares/checkRights")
const { makeController } = require("../controller/makeController")
const { resolveKey } = require("../key/resolveKey")

/**
 * @typedef {{
 *  controller: import("../controller/makeController").RequestHandler;
 *  checkRights: import("express").RequestHandler;
 * } & Omit<import("../key/resolveKey").ResolvedKey, "identifier">} Schema
 *
 * @param {string} prefix
 * @param {{ [key: string]: import("../controller/makeController").RequestHandler }} schema
 *
 * @returns {Schema[]}
 */
exports.resolveSchema = (prefix, schema) => {
    const controllers = []
    for (const key in schema) {
        const { identifier, ...meta } = resolveKey(key)
        const controller = makeController(schema[key])

        meta.middlewares = controllers.push({
            ...meta,
            checkRights: checkRights(prefix, identifier.slice(1)),
            controller,
        })
    }
    return controllers
}
