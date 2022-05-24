const { writeFile } = require("fs").promises
const { ObjectId } = require("mongodb")
const { join } = require("path")
const { extension } = require("mime-types")
const uploadDir = require("./uploadDir")
const { ApiError } = require("./errors")

module.exports = class Body {
  constructor() {}

  $get(key, defaultValue) {
    const value = this[key] || defaultValue

    if (value === undefined) {
      throw new ApiError(`${key}.required`, 400, `"${key}" is required`)
    }

    return value
  }

  $dataURLsToFiles(...keys) {
    keys = keys.length ? keys : ["dataURL"]

    return Promise.all(
      keys.map(async (key) => {
        const dataUrl = this.$get(key)

        const [meta, data] = dataUrl.split(",")
        const [, mimeType, encoding] = /^data:(.+\/.+);(.*)$/.exec(meta) || []

        if (!mimeType) {
          throw new ApiError(`${key}.invalid_data-url`, 400, "Invalid dataUrl")
        }

        const buffer = Buffer.from(data, encoding)
        const fileName = `${ObjectId()}.${extension(mimeType)}`
        const path = join(uploadDir.value, fileName)

        await writeFile(path, buffer)

        return fileName
      })
    )
  }
}
