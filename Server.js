const { createServer } = require("http")
const { ApiError, RouteNotFound, UnknownError } = require("./errors")
const { makeArgs } = require("./functions/makeArgs")
const { Router } = require("./Router")
const { Type } = require("./types/Type")
const { BodyParser } = require("./utils/BodyParser")
const { URL } = require("./utils/URL")

class Server {
    constructor() {
        this.server = createServer((req, res) => {
            req.url = req.url.replace(/\/+/g, "/")
            const { path, query } = URL.parse(req.url)
            const method = req.method.toLowerCase()

            res.setHeader("content-type", "application/json")
            res.setHeader("access-control-allow-origin", "*")
            res.setHeader("access-control-allow-methods", "*")
            res.setHeader("access-control-allow-headers", "*")

            if (method === "options") return res.end()

            const controller = Router.match(method, path)

            req.body = {}
            req.files = {}
            let data = ""
            let response = {
                [req.method]: req.url,
            }

            console.log()
            console.log(req.method, req.url)

            const catchError = (error) => {
                if (!(error instanceof ApiError)) {
                    console.error(error)
                    error = new UnknownError(error)
                }

                res.statusCode = error.status || 400
                response.error = error.clean
                console.log(error.status, error.message.replace(/^\s+/, ""))
            }

            req.on("data", (chunk) => {
                data += chunk
            }).on("end", async () => {
                try {
                    BodyParser.parse(req, data)
                    const args = await makeArgs(req, res, query)
                    if (!controller) throw new RouteNotFound()

                    response.result = await controller.call(args)
                } catch (error) {
                    catchError(error)
                }

                res.end(JSON.stringify(response))
            })
        })
    }
}

exports.Server = Server
