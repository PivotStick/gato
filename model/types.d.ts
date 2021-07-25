import {
    Collection,
    DeleteResult,
    Document,
    Filter,
    InsertManyResult,
    InsertOneResult,
} from "mongodb"

type Options = {
    collection?: string
}

class Model {
    static get collection(): Collection<Document>

    static find(filter: Filter<Document>): Promise<Document[]>
    static findOne(filter: Filter<Document>): Promise<Document>

    static insertOne(doc: Document): Promise<InsertOneResult<Document>>
    static insertMany(doc: Document): Promise<InsertManyResult<Document>>

    static deleteOne(filter: Filter<Document>): Promise<DeleteResult>
    static deleteMany(filter: Filter<Document>): Promise<DeleteResult>
}
