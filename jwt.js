const jwt = require("jsonwebtoken")
const { JWT_SECRET = "secret", JWT_EXPIRES_IN = "1d" } = process.env

exports.verify = (token = "") => {
  return jwt.verify(token, JWT_SECRET)
}

exports.sign = (payload) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  })
}
