const { Auth, Anonymous } = require("../models")
const { JWT } = require("../utils/JWT")

/**
 * @param {import("http").IncomingMessage} req
 * @return {Promise<Anonymous | Auth>}
 */
exports.getCurrentUser = async (req) => {
    const { authorization = "" } = req.headers
    const token = authorization.replace(/^Bearer /, "")
    const anonymous = new Anonymous()

    try {
        const { _id } = JWT.verify(token)
        const user = (await $$User.findOne({ _id })) || anonymous
        return user.removePrivateKeys()
    } catch (error) {
        return anonymous.removePrivateKeys()
    }
}
