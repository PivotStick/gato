const { JWT } = require("../token/JWT")

/** @type {import("express").RequestHandler} */
exports.session = async (req, res, next) => {
    const { authorization } = req.headers
    req.user = {
        profiles: ["anonymous"],
    }

    try {
        if (!authorization) return next()

        const Model = global.models.User || global.models.Auth

        const token = req.headers.authorization.replace(/^Bearer /, "")
        const { _id } = JWT.verifyAndDecode(token)

        const user = await Model.findOne({ _id })

        if (user) req.user = user
    } catch (error) {}

    next()
}
