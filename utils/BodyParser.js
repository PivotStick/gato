const { writeFileSync } = require("fs")
const { join } = require("path")

class BodyParser {
    /**
     * @param {import("http").IncomingMessage} req
     * @param {Buffer} chunk
     */
    static "application/json"(req, chunk) {
        req.body = JSON.parse(chunk.toString())
    }

    /**
     * @param {import("http").IncomingMessage} req
     * @param {Buffer} chunk
     */
    static "multipart/form-data"(req, chunk) {
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
                        a[key] = value.substr(1, value.length - 2)
                        return a
                    }, {})

                if (contentType) {
                    contentType = contentType.replace(/(.*):\s+/, "")
                    const file = {
                        filename,
                        contentType,
                        data: Buffer.from(
                            value.split("").map((l) => l.charCodeAt(0))
                        ),
                        upload(path = "", filename = this.filename) {
                            path = join($$paths.files, path, filename)
                            writeFileSync(path, this.data, {
                                encoding: "binary",
                            })
                        },
                    }
                    req.files[name] = file
                    return
                }

                req.body[name] = value
            })
        // .replace()
    }

    /**
     * @param {import("http").IncomingMessage} req
     */
    static unknown(req) {
        console.log(`"${req.headers["content-type"]}" has no parser yet.`)
    }

    /**
     * @param {import("http").IncomingMessage} req
     * @param {*} chunk
     */
    static parse(req, chunk) {
        let contentType = req.headers["content-type"]
        if (!contentType || !chunk) return
        contentType = contentType.split(";")[0]
        const parser = this[contentType] || this.unknown
        parser(req, chunk)
    }
}

exports.BodyParser = BodyParser
