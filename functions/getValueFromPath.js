/**
 * @param {Record<string, any>} object
 * @param {string} path
 */
exports.getValueFromPath = (object, path) => {
    let key = ""
    path = path.replace(/^(.*)\./, (k) => {
        key = k.replace(/\.$/, "")
        return ""
    })

    return key ? getValueFromPath(object[key], path) : object[path]
}
