const { ObjectId } = require("mongodb")
const { getValueFromPath } = require("../functions/getValueFromPath")
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
    M.$$schema.validate(doc, false)
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
 * @returns {Promise<T>}
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
const castId = (filter = {}) => {
    if (!("_id" in filter)) return
    castDeepId(filter)
}

/**
 * @param {typeof Model} M
 */
const addDescriminator = (M, { document, filter }) => {
    if (M.$$descriminator === false) return filter
    const _$ = toKebabCase(M.name)
    if (document) return (document._$ = _$)

    return { $and: [filter, { _$: _$ }] }
}

class Model {
    _id = ObjectId.prototype

    removePrivateKeys() {
        this.#Model.$$privateKeys.forEach((key) => delete this[key])
        return this
    }

    /** @type {typeof Model} */
    get #Model() {
        return this.constructor
    }

    update(update = {}) {
        return this.#Model.updateOne({ _id: this._id }, update)
    }

    delete() {
        return this.#Model.deleteOne({ _id: this._id })
    }

    /** @param {string} path */
    async populate(path, removePrivateKeys = true) {
        /** @type {Model | Model[]} */
        const M = getValueFromPath(new this.#Model(), path)
        this[path] = await (M.constructor === Array
            ? M[0].constructor.find({ _id: { $in: this[path] } })
            : M.constructor.findOne({ _id: this[path] }))

        if (removePrivateKeys) this[path].removePrivateKeys()
    }

    static get $$descriminator() {
        return false
    }

    static get $$privateKeys() {
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

    static insertOne(document) {
        this.$$schema.validate(document)
        addDescriminator(this, { document })
        return this.$$collection.insertOne(document)
    }

    static insertMany(documents) {
        documents.forEach((document) => {
            this.$$schema.validate(document)
            addDescriminator(this, { document })
        })
        return this.$$collection.insertMany(documents)
    }

    static async find(filter = {}) {
        castId(filter)
        filter = addDescriminator(this, { filter })
        const docs = await this.$$collection.find(filter).toArray()
        return instantiate(this, docs)
    }

    static async findOne(filter = {}) {
        castId(filter)
        filter = addDescriminator(this, { filter })
        const doc = await this.$$collection.findOne(filter)
        return instantiate(this, doc)
    }

    static updateOne(filter = {}, update = {}) {
        castId(filter)
        filter = addDescriminator(this, { filter })
        return this.$$collection.updateOne(filter, update)
    }

    static updateMany(filter = {}, update = {}) {
        castId(filter)
        filter = addDescriminator(this, { filter })
        return this.$$collection.updateMany(filter, update)
    }

    static deleteOne(filter = {}) {
        castId(filter)
        filter = addDescriminator(this, { filter })
        return this.$$collection.deleteOne(filter)
    }

    static deleteMany(filter = {}) {
        castId(filter)
        filter = addDescriminator(this, { filter })
        return this.$$collection.deleteMany(filter)
    }
}

exports.Model = Model
