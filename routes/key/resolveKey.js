const { getPart } = require("./getPart")
const { requires } = require("./requires")

/**
 * @typedef {{
 *  middlewares: string[]
 *  identifier: string
 *  path: string
 * }} ResolvedKey
 *
 * @param {string} key
 * @returns {ResolvedKey}
 */
exports.resolveKey = (key) => {
    let result = {
        middlewares: [],
    }

    for (const string of key.split(/\s+/)) {
        const part = getPart(string)
        if (part.middleware) result.middlewares.push(part.middleware)
        else
            result = {
                ...result,
                ...part,
            }
    }

    requires(result, "path", "identifier")

    return result
}
