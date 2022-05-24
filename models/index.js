const { Model } = require("classy-mongo")
const { ApiError } = require("../errors")
const { sign } = require("../jwt")
const { GATOS_USER_IDENTIFIER_KEY: key = "username" } = process.env

class Auth extends Model {
  profiles = [String.prototype]

  /**
   * @type {<T extends typeof Auth>(this: T, document: InstanceType<T>) => Promise<import("mongodb").InsertOneResult<InstanceType<T>>>}
   */
  static async register(document) {
    const found = await this.collection.findOne({ [key]: document[key] })

    if (found) {
      throw new ApiError(
        `${key}.already_in_use`,
        409,
        `"${key}" is already in use`
      )
    }

    const casted = this.cast(document)
    return this.collection.insertOne({
      ...casted,
      password: document.password,
    })
  }

  /**
   * @param {{
   *  password: string
   * } & Record<string, any>} credentials
   */
  static async login(credentials) {
    const user = await this.collection.findOne({ [key]: credentials[key] })

    if (!user || user.password !== credentials.password) {
      throw new ApiError("credentials.invalid", 400, "Invalid credentials")
    }

    return {
      token: sign({ _id: user._id }),
      expiresAt: null,
    }
  }
}

module.exports = { Model, Auth }
