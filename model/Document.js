const { Collection } = require("mongodb")

exports.Document = class {
    /**
     * @type {Collection}
     */
    #collection

    /**
     * @type {{ validate: (values: any) => void }}
     */
    #schema

    /**
     * @param {import("mongodb").Document} doc
     * @param {Collection} collection
     */
    constructor(doc, collection, schema) {
        this.#setDoc(doc)
        this.#collection = collection
        this.#schema = schema
    }

    async update(update) {
        this.#schema.validate(update)
        const doc = await this.#collection.findOneAndUpdate(
            { _id: this._id },
            update
        )
        console.log(doc)
    }

    async save() {
        const { _id, ...update } = this
        this.#schema.validate(update)
        const doc = await this.#collection.findOneAndUpdate({ _id }, update)
        console.log(doc)
    }

    #setDoc(doc) {
        for (const key in doc) {
            const value = doc[key]
            this[key] = value
        }
    }
}
