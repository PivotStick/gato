const { Auth } = require("./auth/Auth")
const { Model } = require("./model/Model")

/**
 * @type {import("./types").Paths}
 */
globalThis.paths = {
    _security: null,
    _middlewares: null,
    _routes: null,
}

globalThis.mongo = {
    /** @type {import("mongodb").Db} */
    db: null,
}

/**
 * @type {Map<*, import("./types").TypeDef<*>>}
 */
globalThis.types = new Map()

global.types.set(Date, {
    validator: (_, after) => !isNaN(after.valueOf()),
})

global.types.set(Number, {
    _constructor: Number,
    validator: (_, after) => !isNaN(after),
})

global.types.set(String, {
    _constructor: String,
    validator: (before) => typeof before !== "undefined",
})

/**
 * @type {{ User: typeof Auth, Auth: typeof Auth, [key: string]: typeof Model }}
 */
globalThis.models = {
    Auth,
    User: null,
}
