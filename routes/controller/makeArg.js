/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
exports.makeArg = (req, res) => ({
    body: {
        ...req.body,
        require(key) {
            if (!(key in req.body))
                throw Error(`${key} is required in the body`)
            return req.body[key]
        },
    },
    params: req.params,
    query: req.query,

    user: req.user,

    $: {
        //#region status
        get status() {
            return res.statusCode
        },

        set status(/** @type {number} */ n) {
            res.status(n)
        },
        //#endregion

        //#region headers
        get headers() {
            return res.getHeaders()
        },

        set headers(/** @type {{ [key: string]: any }} */ o) {
            for (const name in o) {
                const value = o[name]
                res.setHeader(name, value)
            }
        },
        //#endregion
    },
})
