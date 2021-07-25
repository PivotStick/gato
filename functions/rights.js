/**
 * @param {string | object} schema
 * @param {string} controller
 * @param {string} action
 * @returns {boolean}
 */
exports.resolveRight = (schema = {}, controller, action) => {
    if (
        schema === "*" ||
        schema[controller] === "*" ||
        (!schema[controller] && schema["*"])
    )
        return true

    const c = schema[controller] || {}
    return c[action] ?? c["*"] ?? false
}
