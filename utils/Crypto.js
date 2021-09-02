const { randomBytes, scryptSync, timingSafeEqual } = require("crypto")

const separator = "°"

class Crypto {
    static get randomBytes() {
        return randomBytes
    }

    /** @param {string} password */
    static async hash(password) {
        const salt = randomBytes(8).toString("hex")
        const derivedKey = scryptSync(password, salt, 64)

        return salt + separator + derivedKey.toString("hex")
    }

    /**
     * @param {string} password
     * @param {string} hash
     */
    static async verify(password, hash) {
        const [salt, key] = hash.split(separator)
        const keyBuffer = Buffer.from(key, "hex")
        const derivedKey = scryptSync(password, salt, 64)

        return timingSafeEqual(keyBuffer, derivedKey)
    }
}

exports.Crypto = Crypto
