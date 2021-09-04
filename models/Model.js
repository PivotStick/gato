const { ObjectId } = require("mongodb")
const { toKebabCase } = require("../functions/toKebabCase")
const { toPlural } = require("../functions/toPlural")
const { Schema } = require("../utils/Schema")

/**
 * @param {typeof Model} M
 * @param {*} doc
 */
const set = (M, doc) => {
    if (!doc) return

    const object = new M()
    M.$$schema.validate(doc)
    for (const key in object) {
        if (!(key in doc)) {
            delete object[key]
            continue
        }

        object[key] = doc[key]
    }

    return object
}

/**
 * @template T
 * @param {typeof Model} M
 * @param {T} object
 * @returns {T}
 */
const instantiate = (M, object) =>
    object?.constructor === Array
        ? object.map((o) => set(M, o))
        : set(M, object)

/**
 * @param {import("mongodb").Filter<import("bson").Document>} filter
 */
const castDeepId = (filter = {}, key = "_id") => {
    switch (filter[key]?.constructor) {
        case ObjectId:
            return

        case Object:
            for (const k in filter[key]) castId(filter[key][k], k)
            return

        case Array:
            for (let i = 0; i < filter[key].length; i++)
                castId(filter[key][i], i)
            return

        default:
            filter[key] = new ObjectId(filter[key])
            return
    }
}

/**
 * @param {import("mongodb").Filter<import("bson").Document>} filter
 */
const castId = (filter) => {
    if (!("_id" in filter)) return
    castDeepId(filter)
}

class Model {
    _id = ObjectId.prototype

    removePrivateKeys() {
        this.$$privateKeys.forEach((key) => delete this[key])
        return this
    }

    /** @returns {string[]} */
    get $$privateKeys() {
        return []
    }

    static get $$schema() {
        return new Schema({ ...new this() }, this.name)
    }

    static get $$name() {
        let name = this.name
        name = toKebabCase(name)
        name = toPlural(name)
        return name
    }

    static get $$collection() {
        return $$db.collection(this.$$name)
    }

    /** @param {Partial<Model>} doc */
    static insertOne(doc) {
        this.$$schema.validate(doc)
        return this.$$collection.insertOne(doc)
    }

    /** @param {Partial<Model>[]} docs */
    static insertMany(docs) {
        docs.forEach(this.$$schema.validate)
        return this.$$collection.insertMany(docs)
    }

    /**
     * @param {import("mongodb").Filter<Model>} filter
     * @returns {Promise<Model[]>}
     */
    static async find(filter) {
        castId(filter)
        const docs = await this.$$collection.find(filter).toArray()
        return instantiate(this, docs)
    }

    /**
     * @param {import("mongodb").Filter<Model>} filter
     * @returns {Promise<Model>}
     */
    static async findOne(filter) {
        castId(filter)
        const doc = await this.$$collection.findOne(filter)
        return instantiate(this, doc)
    }

    /** @param {import("mongodb").Filter<Model>} filter */
    static updateOne(filter, update) {
        castId(filter)
        return this.$$collection.updateOne(filter, update)
    }

    /** @param {import("mongodb").Filter<Model>} filter */
    static updateMany(filter, update) {
        castId(filter)
        return this.$$collection.updateMany(filter, update)
    }

    /** @param {import("mongodb").Filter<Model>} filter */
    static deleteOne(filter) {
        castId(filter)
        return this.$$collection.deleteOne(filter)
    }

    /** @param {import("mongodb").Filter<Model>} filter */
    static deleteMany(filter) {
        castId(filter)
        return this.$$collection.deleteMany(filter)
    }
}

exports.Model = Model
