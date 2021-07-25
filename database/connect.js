const { MongoClient } = require("mongodb")

exports.connect = async (url = "mongodb://localhost:27017/test") => {
    const mongo = new MongoClient(url)
    const client = await mongo.connect()
    return client.db()
}
