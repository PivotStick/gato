const { ObjectId } = require("mongodb")
const { Auth } = require("./auth/Auth")
const { Model } = require("./model/Model")

/**
 * @type {import("./types").Paths}
 */
global.paths = {
    _middlewares: null,
    _routes: null,
}

global.mongo = {
    /** @type {import("mongodb").Db} */
    db: null,
}

/**
 * @type {Map<*, import("./types").TypeDef<*>>}
 */
global.types = new Map()

global.types.set(Date, {
    validator: (_, after) => !isNaN(after.valueOf()),
})

global.types.set(ObjectId, {
    validator: ObjectId.isValid,
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
global.models = {
    Auth,
    User: null,
}

globalThis.profiles = {
    anonymous: ["anonymous"],
}

globalThis.rights = {
    anonymous: {},
}
