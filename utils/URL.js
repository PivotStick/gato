class URL {
    /**
     * @param {string} url
     */
    static parse(url) {
        const [path, query = ""] = url.split("?")

        return {
            path: this.formatPath(path),
            query: this.formatQuery(query),
        }
    }

    /**
     * @param {string} path
     */
    static splitPath(path) {
        let prefix = ""
        let endpoint = path.replace(/^\/?\w+/, (p) => {
            prefix = p.replace(/\/+/g, "")
            return ""
        })

        return { prefix, endpoint }
    }

    /**
     * @param {string} path
     */
    static formatPath(path) {
        return path.replace(/\/+/g, "/").replace(/\/$/, "")
    }

    /**
     * @param {string} query
     */
    static formatQuery(query) {
        if (!query.trim()) return {}
        return query.split("&").reduce((a, pair) => {
            const [key, value] = pair.split("=")
            a[key] = value
            return a
        }, {})
    }
}

exports.URL = URL
