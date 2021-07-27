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
 * @param {(controller: import("express").RequestHandler) => void} callback
 *
 * @returns {Schema[]}
 */
exports.resolveSchema = function* (prefix, schema) {
    for (const key in schema) {
        const { identifier, ...meta } = resolveKey(key)
        const controller = makeController(schema[key])

        yield {
            ...meta,
            checkRights: checkRights(prefix.slice(1), identifier.slice(1)),
            controller,
        }
    }
}
