const { writeFile } = require("fs").promises
const { ObjectId } = require("mongodb")
const { join } = require("path")
const { extension } = require("mime-types")
const uploadDir = require("./uploadDir")
const { ApiError } = require("./errors")

module.exports = class Body {
  constructor() {}

  $require(key, defaultValue) {
    const value = this[key] !== undefined ? this[key] : defaultValue

    if (value === undefined) {
      throw new ApiError(
        `${key}.undefined`,
        400,
        `"${key}" is undefined without default value`
      )
    }

    return value
  }

  $parseDataURL(key) {
    const dataUrl = this.$get(key)

    const [meta, data] = dataUrl.split(",")
    const [, mimeType, encoding] = /^data:(.+\/.+);(.*)$/.exec(meta) || []

    if (!mimeType) {
      throw new ApiError(`${key}.invalid_data-url`, 400, "Invalid dataUrl")
    }

    return {
      buffer: Buffer.from(data, encoding),
      mimeType,
    }
  }

  $dataURLsToFiles(...keys) {
    keys = keys.length ? keys : ["dataURL"]

    return Promise.all(
      keys.map(async (key) => {
        const { buffer, mimeType } = this.$parseDataURL(key)

        const fileName = `${ObjectId()}.${extension(mimeType)}`
        const path = join(uploadDir.value, fileName)

        await writeFile(path, buffer)

        return fileName
      })
    )
  }
}
