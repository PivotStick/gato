const { writeFile } = require("fs").promises
const { ObjectId } = require("mongodb")
const { join } = require("path")
const { extension } = require("mime-types")
const uploadDir = require("./uploadDir")

module.exports = class Body {
  constructor() {}

  $require(key, defaultValue) {
    const value = this[key] || defaultValue

    if (value === undefined) {
      throw new Error(`"${key}" is required`)
    }

    return value
  }

  $dataURLsToFiles(...keys) {
    keys = keys.length ? keys : ["dataURL"]

    return Promise.all(
      keys.map(async (key) => {
        const dataUrl = this.$require(key)

        const [meta, data] = dataUrl.split(",")
        const [, mimeType, encoding] = /^data:(.+\/.+);(.*)$/.exec(meta) || []

        if (!mimeType) {
          throw new Error("Invalid dataUrl")
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
