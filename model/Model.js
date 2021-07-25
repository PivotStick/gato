const { ObjectId } = require("mongodb")
const { Schema } = require("../schema/Schema")
const { kebabCase } = require("./kebabCase")

const instantiate = (ctx, document) => {
    return document ? new ctx(document) : null
}

const formatFilter = (filter) => {
    if (!filter || filter._id?.constructor !== ObjectId) return

    filter._id = new ObjectId(filter._id)
}

// /**
//  * @type {import("./types").CreateModel}
//  */
class Model {
    /**
     * @type {typeof Model}
     */
    #ctx

    /**
     * @type {ObjectId}
     */
    _id

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

    static get collectionName() {
        return kebabCase(this.options.collection ?? this.name)
    }

    static get collection() {
        return global.mongo.db.collection(this.collectionName)
    }

    static get options() {
        return {}
    }

    static async find(filter) {
        const documents = await this.collection.find(filter).toArray()
        return documents.map((document) => instantiate(this, document))
    }

    static async findOne(filter) {
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

    static updateOne(filter, update) {
        this.validate(update)
        return this.collection.updateOne(filter, update)
    }

    static updateMany(filter, update) {
        this.validate(update)
        return this.collection.updateMany(filter, update)
    }

    static deleteOne(filter) {
        return this.collection.deleteOne(filter)
    }

    static deleteMany(filter) {
        return this.collection.deleteMany(filter)
    }
}

exports.Model = Model
