const regex = /y$/i

/**
 * @param {string} string
 */
exports.toPlural = (string) =>
    regex.test(string) ? string.replace(regex, "ies") : string + "s"
