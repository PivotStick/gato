const uploadDir = require("../uploadDir")
const { writeFile } = require("fs").promises
const { join } = require("path")

/**
 * @type {Record<string, (req: import("http").IncomingMessage, chunk: string) => void>}
 */
const parsers = {
  "application/json": (req, chunk) => {
    req.body = JSON.parse(chunk)
  },

  "multipart/form-data": (req, chunk) => {
    const boundary = req.headers["content-type"].replace(/^(.*)=/, "")
    const regex = new RegExp(`\\s*--${boundary}\\s*`, "g")

    chunk
      .toString("binary")
      .replace(/--\s*$/, "")
      .split(regex)
      .forEach((part) => {
        if (!part) return
        const parts = part.split(/\r\n/g).filter((v) => v)
        let [value] = parts.splice(-1)
        let [contentDisposition, contentType] = parts

        const { name, filename } = contentDisposition
          .split(/\s*;\s*/g)
          .slice(1)
          .reduce((a, c) => {
            const [key, value] = c.split("=")
            a[key] = value.slice(1, -1)
            return a
          }, {})

        if (contentType) {
          contentType = contentType.replace(/(.*):\s+/, "")
          const file = {
            filename,
            contentType,
            data: Buffer.from(value.split("").map((l) => l.charCodeAt(0))),
            async upload(path = "", filename = this.filename) {
              path = join(uploadDir.value, path, filename)
              await writeFile(path, this.data, {
                encoding: "binary",
              })
              return path
            },
          }
          req.files[name] = file
          return
        }

        req.body[name] = value
      })
  },
}

const noop = () => {}

/**
 * @param {import("http").IncomingMessage} req
 * @param {any} chunk
 */
exports.parseBody = async (req, chunk) => {
  const contentType = (req.headers["content-type"] || "").split(";")[0]
  const parser = parsers[contentType] || noop

  parser(req, chunk)
}
