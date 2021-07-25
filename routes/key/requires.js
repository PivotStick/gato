/**
 * @param {any} o
 * @param  {...string} keys
 */
exports.requires = (o, ...keys) => {
    const currentKeys = Object.keys(o)
    for (const key of keys)
        if (!currentKeys.includes(key)) throw Error(`"${key}" key expected`)
}
