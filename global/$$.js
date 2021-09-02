const { Router } = require("../Router")

/**
 * @param {import("../@types").Method} method
 * @param {import("../@types").Schema} schema
 */
const use = (method, schema) => {
    if (Router.$$router === null) return

    for (const key in schema) {
        const callback = schema[key]
        Router.$$router.use(method, key, callback)
    }
}

/**
 * @type {import("../@types").$$}
 */
globalThis.$$ = {}

for (const method of ["get", "post", "patch", "put", "delete"]) {
    Object.defineProperty($$, method, {
        set: (v) => use(method, v),
    })
}
