const jwt = require("jsonwebtoken")
const { ObjectId } = require("mongodb")

const { JWT_SECRET = "ozaijeoajzoejaziejoaizjeo" } = process.env

exports.JWT = class {
    constructor(payload) {
        this.jwt = jwt.sign(payload, JWT_SECRET, {
            expiresIn: "1h",
        })
    }

    static verify(token) {
        return jwt.verify(token, JWT_SECRET)
    }

    static decode(token) {
        return jwt.decode(token)
    }

    static verifyAndDecode(token) {
        this.verify(token)
        const payload = this.decode(token)
        payload._id = new ObjectId(payload._id)
        return payload
    }
}
