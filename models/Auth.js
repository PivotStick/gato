const { ApiError, AuthError } = require("../errors")
const { Model } = require("./Model")
const { Crypto } = require("../utils/Crypto")
const { JWT } = require("../utils/JWT")

class Auth extends Model {
    profiles = [String.prototype]

    password = String.prototype

    hasRole(role) {
        return this.profiles.includes(role)
    }

    static get $$name() {
        return "users"
    }

    static get $$privateKeys() {
        return ["password"]
    }

    static get $$identifierKey() {
        return "username"
    }

    static async login({ identifier, password }) {
        const user = await this.findOne({
            [this.$$identifierKey]: identifier,
        })

        if (!user) throw new AuthError(this.$$identifierKey)

        const isValid = await Crypto.verify(password, user.password)

        if (!isValid) throw new AuthError(this.$$identifierKey)

        return JWT.sign({ _id: user._id })
    }

    static async register({
        [this.$$identifierKey]: identifier,
        password,
        profiles = [],
        ...props
    }) {
        const user = await this.findOne({
            [this.$$identifierKey]: identifier,
        })
        if (user)
            throw new ApiError(
                400,
                `"${this.$$identifierKey}" is already in use`
            )

        return await this.insertOne({
            ...props,
            profiles,
            [this.$$identifierKey]: identifier,
            password: await Crypto.hash(password),
        })
    }

    async updatePassword(password) {
        this.password = await Crypto.hash(password)
        return await this.update({
            $set: { password: this.password },
        })
    }
}

globalThis.$$User = Auth
exports.Auth = Auth
