const { join } = require("path")

const matchers = {
    middlewares: {
        regex: /^@\w+$/,
        cleaner: /^@/,
    },
    id: {
        regex: /^#[\w-]+$/,
        cleaner: /^#/,
    },
    endpoint: {
        regex: /^\/(:?\w*\/?)*$/,
    },
}

/**
 * @param {string} string
 */
const match = (string) => {
    for (const key in matchers) {
        const { regex, cleaner } = matchers[key]
        if (regex.test(string))
            return {
                key,
                value: cleaner ? string.replace(cleaner, "") : string,
            }
    }

    return {}
}

class Key {
    /**
     * @param {string} key
     */
    static parse(key) {
        const parts = key.split(/\s+/g)
        /**
         * @type {string[]}
         */
        const middlewares = []
        const result = {
            set middlewares(m) {
                middlewares.push(m)
            },
            endpoint: "",
            id: "",
        }

        for (const part of parts) {
            const { key, value } = match(part)
            if (key) result[key] = value
        }

        return {
            ...result,
            /**
             * @type {import("../@types").Handler[]}
             */
            middlewares: middlewares.map((m) =>
                require(join($$paths.middlewares, m))
            ),
        }
    }

    /**
     * @param {string} endpoint
     */
    static generateEndpointRegex(endpoint) {
        endpoint += "/"
        let pattern = endpoint
            .replace(/\/+/g, "\\/")
            .replace(/:\w+/, (m) => `(?<${m.slice(1)}>\\w+)`)
            .replace(/\\\/$/, "$&?")

        return new RegExp(`^${pattern}$`, "i")
    }
}

exports.Key = Key
