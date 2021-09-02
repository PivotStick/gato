const { sign, verify } = require("jsonwebtoken")
const { Crypto } = require("./Crypto")

const { JWT_KEY = Crypto.randomBytes(64).toString("hex") } = process.env

class JWT {
    static sign(payload) {
        return sign(payload, JWT_KEY)
    }

    /**
     * @param {string} token
     */
    static verify(token) {
        return verify(token, JWT_KEY)
    }
}

exports.JWT = JWT
