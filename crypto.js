const crypto = require("crypto")

const separator = ".:."
const keylen = 64
const encoding = "hex"

/**
 * @param {string} password
 */
exports.hash = (password) =>
  new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString(encoding)

    crypto.scrypt(password, salt, keylen, (err, derivedKey) => {
      if (err) return reject(err)
      resolve(salt + separator + derivedKey.toString(encoding))
    })
  })

/**
 * @param {string} password
 * @param {string} hash
 */
exports.compare = (password, hash) =>
  new Promise((resolve, reject) => {
    const [salt, key] = hash.split(separator)

    crypto.scrypt(password, salt, keylen, (err, derivedKey) => {
      if (err) return reject(err)
      const equality = crypto.timingSafeEqual(
        derivedKey,
        Buffer.from(key, encoding)
      )
      resolve(equality)
    })
  })
