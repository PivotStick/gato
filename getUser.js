const { readdirSync } = require("fs")
const { join } = require("path")
const { Auth } = require("./models")
const jwt = require("./jwt")

let UserModel = Auth

class Anonymous {
  _id = -1
  profiles = ["anonymous"]
}

/**
 * @param {import("http").IncomingMessage} request
 */
exports.getUser = async (request) => {
  const { authorization = "" } = request.headers
  const [, token] = authorization.split(/\s+/g)

  let user = new Anonymous()

  try {
    const { _id } = jwt.verify(token)
    const found = await UserModel.findOne({ _id })

    if (found) {
      user = found
    }
  } catch (error) {
  } finally {
    return user
  }
}

/**
 * @param {string} modelsDir
 */
exports.getUserModel = (modelsDir) => {
  for (const file of readdirSync(modelsDir)) {
    const Model = require(join(modelsDir, file))

    if (Model.prototype instanceof Auth) {
      UserModel = Model
      return
    }
  }
}
