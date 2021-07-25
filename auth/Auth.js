const { Model } = require("../model/Model")
const { JWT } = require("../token/JWT")
const { Crypto } = require("./Crypto")

let identifier = "username"

class Auth extends Model {
    profiles = [String.prototype]

    password = String.prototype

    set(document) {
        super.set(document)
        if (document !== undefined) delete this.password
    }

    static get identifer() {
        return identifier
    }

    static set identifer(v) {
        identifier = v
    }

    static async login({ id, password }) {
        /**
         * @type {Auth}
         */
        const user = await this.collection.findOne({ [this.identifer]: id })

        if (!user || !Crypto.compare(password, user.password))
            throw new Error("username or password wrong")

        return new JWT({ _id: user._id })
    }

    static async create(profiles, payload) {
        const exists = await this.findOne({
            [this.identifer]: payload[this.identifer],
        })

        if (exists) throw new Error("This user already exists")

        payload.password = await Crypto.hash(payload.password)

        return await this.insertOne({
            ...payload,
            profiles,
        })
    }
}

exports.Auth = Auth
