const express = require("express")

const { safeFindDir } = require("./routes/architecture/findDir")
const { useRouters } = require("./routes/router/useRouters")
const { session } = require("./middlewares/session")
const { errorHandler } = require("./middlewares/errorHandler")
const { connect } = require("./database/connect")
const { routeNotFound } = require("./middlewares/routeNotFound")

require("./initGlobal")

class App {
    /** @type {import("express").Express} */
    #app

    /** @type {*} */
    #architecture

    /** @type {import("./types").Options} */
    #options

    /**
     * @param {*} architecture
     * @param {import("./types").Options} options
     */
    constructor(architecture, options = {}) {
        this.#app = express()
        this.#architecture = architecture
        this.#options = options

        global.paths._routes = this.#findDir("routes")
        global.paths._middlewares = this.#findDir("middlewares")
        global.paths._security = this.#findDir("security").path

        this.#app.use(express.json())
        this.#app.use(session)
        useRouters(this.#app)
        this.#app.use(routeNotFound)
        this.#app.use(errorHandler)
    }

    /** @param {DirName} key */
    #getDir(key) {
        return this.#options?.dirNames?.[key] || key
    }

    /** @param {DirName} key */
    #findDir(key) {
        return safeFindDir(this.#architecture, this.#getDir(key))
    }

    async listen(
        port = 7070,
        callback = () => {
            console.log(`http://localhost:${port}`)
        }
    ) {
        global.mongo.db = await connect(this.#options.mongo?.url)

        console.clear()
        console.log(
            `\x1b[1m=== Connected to DB "${global.mongo.db.databaseName}" ===\n\x1b[0m`
        )

        this.#app.listen(port, callback)
    }
}

exports.App = App
