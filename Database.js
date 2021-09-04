const { MongoClient } = require("mongodb")

class Database {
    /**
     * @param {string} uri
     */
    static async connect(url) {
        const client = await new MongoClient(url).connect()
        console.log(
            `\x1b[1m== \x1b[34m\x1b[4m${url}\x1b[0m\x1b[1m connected! ==\n\x1b[0m`
        )
        globalThis.$$db = client.db()
    }
}

exports.Database = Database
