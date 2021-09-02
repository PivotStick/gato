const { Auth } = require("./models/Auth")
const { ForbiddenError } = require("./errors")
const { checkUserAccess } = require("./functions/checkUserAccess")
const { Key } = require("./utils/Key")

class Controller {
    /**
     * @param {string} key
     * @param {string} prefix
     * @param {import("./@types").Handler} handler
     */
    constructor(key, prefix, handler) {
        const { id, middlewares, endpoint } = Key.parse(key)
        this.id = id
        this.middlewares = middlewares
        this.endpoint = Key.generateEndpointRegex(endpoint)
        this.handler = handler
        this.params = {}
        this.prefix = prefix
    }

    /**
     * @param {string} endpoint
     */
    match(endpoint) {
        let match = this.endpoint.exec(endpoint)
        if (!match) return false

        const { groups = {} } = match
        this.params = { ...groups }

        return true
    }

    /**
     * @param {Auth} user
     */
    checkUserAccess(user) {
        const hasAccess = checkUserAccess(user, this.prefix, this.id)
        if (!hasAccess) throw new ForbiddenError()
    }

    /**
     * @param {import("./@types/Args").Args} args
     */
    async call(args) {
        this.checkUserAccess(args.user)
        args.params = this.params
        for (let i = 0; i < this.middlewares.length; i++) {
            const middleware = this.middlewares[i]
            await middleware(args)
        }
        return await this.handler(args)
    }
}

exports.Controller = Controller
