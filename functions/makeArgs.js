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
    req.body.require = function (key, defaultValue) {
        if (!(key in req.body)) {
            if (arguments.length !== 2)
                throw new ApiError(400, `"${key}" is missing in the body`)

            req.body[key] = defaultValue
        }

        return req.body[key]
    }

    const user = await getCurrentUser(req)

    return {
        user,
        query,
        params,

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
