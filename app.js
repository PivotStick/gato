const fs = require("fs")
const { join } = require("path")
const { Server } = require("./Server")
const { Router } = require("./Router")
const { Database } = require("./Database")
const { generateEvents } = require("./functions/generateEvents")

const setPath = (key, path) => {
    $$paths[key] = join(require.main.path, path)
}

let clear = false
const server = new Server().server

class App {
    /**
     * @type {Server}
     */
    static io = null

    static set middlewares(path) {
        setPath("middlewares", path)
    }

    static set routes(path) {
        setPath("routes", path)
    }

    static set files(path) {
        setPath("files", path)
    }

    static set sockets(path) {
        setPath("sockets", path)
        this.io = new (require("socket.io").Server)(server, {
            cors: "*",
        })
        generateEvents(io)
    }

    static get clear() {
        clear = true
        return this
    }

    static setRoutes() {
        const path = $$paths.routes
        if (!path) return

        const routes = fs.readdirSync(path)
        for (const route of routes) {
            const prefix = route.replace(/\.\w+$/, "")
            new Router(prefix)
            require(join(path, route))
        }

        Router.$$router = null
    }

    static async listen(
        port = 7070,
        mongodbUrl = "mongodb://localhost:27017/gatos",
        callback = () => console.log(`listening at http://localhost:${port}`)
    ) {
        if (clear) console.clear()
        await Database.connect(mongodbUrl)

        this.setRoutes()
        server.listen(port, callback)
    }
}

exports.App = App
