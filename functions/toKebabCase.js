/**
 * @param {string} string
 */
exports.toKebabCase = (string) => {
    let rest = string.slice(1).replace(/[A-Z]/g, (m) => `-${m}`)

    string = string[0] + rest

    return string.toLowerCase()
}
