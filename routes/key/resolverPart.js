/**
 * @param {string} part
 * @param {string} key
 * @param {RegExp} regex
 */
exports.resolvePart = (part, key, regex) =>
    regex.test(part) ? { [key]: part } : null
