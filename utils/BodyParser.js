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
        const contentType = req.headers["content-type"]
        if (!contentType || !chunk) return
        const parser = this[contentType] || this.unknown
        parser(req, chunk)
    }
}

exports.BodyParser = BodyParser
