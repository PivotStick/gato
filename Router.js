const { Controller } = require("./Controller")
const { URL } = require("./utils/URL")

/** @type {Router[]} */ const routers = []
/** @type {Router} */ let currentRouter = null

class Router {
    static get $$router() {
        return currentRouter
    }

    static set $$router(v) {
        currentRouter = v
    }

    /**
     * @type {{ [M in import("./@types").Method]: Controller[] }}
     */
    controllers = {
        get: [],
        post: [],
        patch: [],
        put: [],
        delete: [],
    }

    constructor(prefix) {
        this.prefix = prefix
        routers.push(this)
        currentRouter = this
    }

    /**
     * @param {import("./@types").Method} method
     * @param {string} key
     * @param {import("./@types").Handler} callback
     */
    use(method, key, callback) {
        const controller = new Controller(key, this.prefix, callback)
        this.controllers[method].push(controller)
    }

    /**
     * @param {import("./@types").Method} method
     * @param {string} path
     */
    match(method, path) {
        const { prefix, endpoint } = URL.splitPath(path)
        if (prefix !== this.prefix) return null

        for (const controller of this.controllers[method]) {
            if (controller.match(endpoint)) return controller
        }
    }

    /**
     * @param {import("./@types").Method} method
     * @param {string} path
     */
    static match(method, path) {
        for (let i = 0; i < routers.length; i++) {
            const router = routers[i]
            const controller = router.match(method, path)

            if (controller) return controller
        }
    }
}

exports.Router = Router
