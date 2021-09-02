class BodyParser {
    static "application/json"(req, chunk) {
        req.body = JSON.parse(chunk.toString())
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
        ;(this[req.headers["content-type"]] || this.unknown)(req, chunk)
    }
}

exports.BodyParser = BodyParser
