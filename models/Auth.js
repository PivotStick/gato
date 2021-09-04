const { ApiError, AuthError } = require("../errors")
const { Model } = require("./Model")
const { Crypto } = require("../utils/Crypto")
const { JWT } = require("../utils/JWT")

class Auth extends Model {
    profiles = [String.prototype]

    password = String.prototype

    /**
     * @param {keyof typeof $$roles} role
     */
    hasRole(role) {
        return this.profiles.includes(role)
    }

    get $$privateKeys() {
        return ["password"]
    }

    static get $$identifierKey() {
        return "username"
    }

    /**
     * @param {Record<"identifier" | "password", string>} param0
     */
    static async login({ identifier, password }) {
        /** @type {Auth} */
        const user = await this.findOne({
            [this.$$identifierKey]: identifier,
        })

        if (!user) throw new AuthError(this.$$identifierKey)

        const isValid = await Crypto.verify(password, user.password)

        if (!isValid) throw new AuthError(this.$$identifierKey)

        return JWT.sign({ _id: user._id })
    }

    /**
     * @param {string[]} profiles
     * @param {Record<"identifier" | "password", string> & Record<string, any>} param1
     */
    static async register(profiles, { identifier, password, ...props }) {
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
            profiles: profiles || [],
            [this.$$identifierKey]: identifier,
            password: await Crypto.hash(password),
        })
    }
}

globalThis.$$User = Auth
exports.Auth = Auth
