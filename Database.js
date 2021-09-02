const { MongoClient } = require("mongodb")

class Database {
    /**
     * @param {string} uri
     */
    static async connect(url) {
        const client = await new MongoClient(url).connect()
        global.db = client.db()
    }
}

exports.Database = Database
