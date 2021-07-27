const { ObjectId } = require("mongodb")
const { Schema } = require("../schema/Schema")
const { kebabCase } = require("./kebabCase")

/**
 *
 * @param {typeof Model} ctx
 * @param {import("mongodb").Document} document
 * @returns
 */
const instantiate = (ctx, document) => {
    return document ? new ctx(document) : null
}

const formatFilter = (filter) => {
    if (!filter || filter._id?.constructor === ObjectId) return

    filter._id = new ObjectId(filter._id)
}

class Model {
    /**
     * @type {typeof Model}
     */
    #ctx

    /**
     * @type {ObjectId}
     */
    _id = ObjectId.prototype

    constructor(ctx) {
        this.#ctx = ctx
    }

    async update(update) {
        this.#ctx.validate(update)
        const doc = await this.#ctx.collection.findOneAndUpdate(
            { _id: this._id },
            update
        )
        console.log(doc)
    }

    async save() {
        const { _id, ...update } = this
        this.#ctx.validate(update)
        const exists = await this.#ctx.collection.findOne({ _id })
        const doc = await this.#ctx.collection.findOneAndUpdate({ _id }, update)
        console.log(doc)
    }

    set(document) {
        if (document === undefined) return

        const { _id = new ObjectId(), ...content } = document
        this.#ctx.validate(content)

        document = { _id, ...content }
        for (const key in { ...this, ...document }) {
            if (!(key in document)) {
                delete this[key]
                continue
            }

            this[key] = document[key]
        }
    }

    static get Schema() {
        const { ...schema } = new this()
        return schema
    }

    static validate(values = {}) {
        const schema = this.Schema
        new Schema(values.constructor === Array ? [schema] : schema).validate(
            values
        )
    }

    static get collection() {
        const collectionName = kebabCase(
            this.options.collectionName ?? this.name
        )
        return global.mongo.db.collection(collectionName)
    }

    /**
     * @type {import("./types").Options}
     */
    static get options() {
        return {}
    }

    /**
     * @template T
     * @param {import("mongodb").Filter<T>} filter
     * @returns {Promise<Model[]>}
     */
    static async find(filter) {
        formatFilter(filter)
        const documents = await this.collection.find(filter).toArray()
        return documents.map((document) => instantiate(this, document))
    }

    /**
     * @method
     * @param {import("mongodb").Filter<T>} filter
     * @returns {Promise<Model<T>>}
     */
    static async findOne(filter) {
        formatFilter(filter)
        const document = await this.collection.findOne(filter)
        return instantiate(this, document)
    }

    static insertOne(document) {
        this.validate(document)
        return this.collection.insertOne(document)
    }

    static insertMany(documents) {
        this.validate(documents)
        return this.collection.insertMany(documents)
    }

    /**
     * @template T
     * @param {import("mongodb").Filter<T>} filter
     * @param {Partial<T>} update
     */
    static updateOne(filter, update) {
        formatFilter(filter)
        this.validate(update)
        return this.collection.updateOne(filter, update)
    }

    /**
     * @template T
     * @param {import("mongodb").Filter<T>} filter
     * @param {Partial<T>} update
     */
    static updateMany(filter, update) {
        formatFilter(filter)
        this.validate(update)
        return this.collection.updateMany(filter, update)
    }

    /**
     * @template T
     * @param {import("mongodb").Filter<T>} filter
     */
    static deleteOne(filter) {
        formatFilter(filter)
        return this.collection.deleteOne(filter)
    }

    /**
     * @template T
     * @param {import("mongodb").Filter<T>} filter
     */
    static deleteMany(filter) {
        formatFilter(filter)
        return this.collection.deleteMany(filter)
    }
}

exports.Model = Model
