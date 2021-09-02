const { ObjectId } = require("mongodb")
const { toKebabCase } = require("../functions/toKebabCase")
const { toPlural } = require("../functions/toPlural")
const { Schema } = require("../utils/Schema")

/**
 * @param {Schema} schema
 * @param {*} object
 * @param {*} doc
 */
const set = (schema, object, doc) => {
    if (!doc) return

    schema.validate(doc)
    for (const key in object) {
        if (!(key in doc)) {
            delete object[key]
            continue
        }

        object[key] = doc[key]
    }

    return object
}

const instantiate = (Model, object) =>
    object?.constructor === Array
        ? object.map((o) => set(Model.schema, new Model(), o))
        : set(Model.schema, new Model(), object)

const castId = (filter = {}) => {
    if (!("_id" in filter)) return
    if (filter._id.constructor === ObjectId) return

    filter._id = new ObjectId(filter._id)
}

class Model {
    _id = ObjectId.prototype

    static get schema() {
        return new Schema({ ...new this() }, this.name)
    }

    static get collectionName() {
        let name = this.name
        name = toKebabCase(name)
        name = toPlural(name)
        return name
    }

    static get collection() {
        return global.db.collection(this.collectionName)
    }

    static insertOne(doc) {
        this.schema.validate(doc)
        return this.collection.insertOne(doc)
    }

    static insertMany(docs) {
        docs.forEach(this.schema.validate)
        return this.collection.insertMany(docs)
    }

    /** @param {import("mongodb").Filter<Model>} filter */
    static async find(filter) {
        castId(filter)
        const docs = await this.collection.find(filter).toArray()
        return instantiate(this, docs)
    }

    /** @param {import("mongodb").Filter<Model>} filter */
    static async findOne(filter) {
        castId(filter)
        const doc = await this.collection.findOne(filter)
        return instantiate(this, doc)
    }

    /** @param {import("mongodb").Filter<Model>} filter */
    static updateOne(filter, update) {
        castId(filter)
        return this.collection.updateOne(filter, update)
    }

    /** @param {import("mongodb").Filter<Model>} filter */
    static updateMany(filter, update) {
        castId(filter)
        return this.collection.updateMany(filter, update)
    }

    /** @param {import("mongodb").Filter<Model>} filter */
    static deleteOne(filter) {
        castId(filter)
        return this.collection.deleteOne(filter)
    }

    /** @param {import("mongodb").Filter<Model>} filter */
    static deleteMany(filter) {
        castId(filter)
        return this.collection.deleteMany(filter)
    }
}

exports.Model = Model
