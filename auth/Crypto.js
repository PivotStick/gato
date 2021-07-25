const crypto = require("crypto")
const { Random } = require("../utils/Random")

exports.Crypto = class {
    static hash(password) {
        return new Promise((resolve, reject) => {
            const salt = crypto.randomBytes(16).toString("hex")
            crypto.scrypt(password, salt, 64, (err, derivedKey) => {
                if (err) return reject(err)

                resolve(`${salt}:${derivedKey.toString("hex")}`)
            })
        })
    }

    static compare(password, hash) {
        return new Promise((resolve, reject) => {
            const [salt, key] = hash.split(":")
            crypto.scrypt(password, salt, 64, (err, derivedKey) => {
                if (err) return reject(err)

                resolve(derivedKey.toString("hex") === key)
            })
        })
    }

    static generatePassword(length = 8) {
        if (length < 8)
            throw new Error("Password length can only be higher than 8")

        const fixLength = Math.floor(length / 4)
        const rest = length % 4

        const specialsChars = Random.specialChar(fixLength).split("")
        const lowerChars = Random.lowercase(fixLength).split("")
        const upperChars = Random.uppercase(fixLength).split("")
        const numbers = []

        for (let i = 0; i < fixLength + rest; i++)
            numbers[i] = Random.range(0, 9)

        const elements = [
            ...specialsChars,
            ...lowerChars,
            ...upperChars,
            ...numbers,
        ]

        let password = ""

        const count = elements.length
        for (let i = 0; i < count; i++) {
            const randomIndex = Random.range(0, elements.length - 1)
            const element = elements.splice(randomIndex, 1)[0]

            password += element
        }

        return password
    }
}
