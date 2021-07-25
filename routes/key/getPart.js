const parts = require("./parts")
const { resolvePart } = require("./resolverPart")

/**
 * @param {string} string
 */
exports.getPart = (string) => {
    for (const key in parts) {
        const regex = parts[key]
        const result = resolvePart(string, key, regex)
        if (result) return result
    }

    return {}
}
