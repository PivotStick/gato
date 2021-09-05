const { ApiError } = require("../errors")
const { getCurrentUser } = require("./getCurrentUser")

/**
 * @param {import("http").IncomingMessage} req
 * @param {import("http").ServerResponse} res
 * @param {Record<string, string>} query
 * @param {Record<string, string>} params
 *
 * @returns {import("../@types/Args").Args}
 */
exports.makeArgs = async (req, res, query, params = {}) => {
    req.body.require = function require(key, defaultValue) {
        if (!(key in req.body)) {
            if (arguments.length !== 2)
                throw new ApiError(400, `"${key}" is missing in the body`)

            req.body[key] = defaultValue
        }

        return req.body[key]
    }

    req.body.requireAll = function requireAll(...keys) {
        const missingKeys = []
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i]
            if (!(key in req.body)) missingKeys.push(key)
        }

        if (missingKeys.length) {
            const word = missingKeys.length > 1 ? "are" : "is"
            throw new ApiError(
                400,
                `"${missingKeys.join(", ")}" ${word} missing in the body`
            )
        }

        return req.body
    }

    const user = await getCurrentUser(req)

    return {
        user,
        query,
        params,

        files: req.files,
        body: req.body,

        $: {
            get status() {
                return res.statusCode
            },

            set status(v) {
                res.statusCode = v
            },
        },
    }
}
