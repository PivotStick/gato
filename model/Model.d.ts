import {
    Collection,
    DeleteResult,
    Document,
    Filter,
    InsertManyResult,
    InsertOneResult,
    UpdateFilter,
    UpdateResult,
} from "mongodb"
import { Options } from "../@types/Options"

export class Model<T> {
    _id = ObjectId.prototype

    constructor(ctx: T)

    async update(update: Filter<T>): Promise<void>
    async save(): Promise<void>

    set(document: Document & T): void

    static get Schema(): T
    static get collection(): Collection<T>
    static get options(): Options

    static validate(values: Partial<T> | Partial<T>[]): void

    static async find(filter: Filter<T>): Promise<T[]>
    static async findOne(filter: Filter<T>): Promise<T>

    static insertOne(document: Document & T): Promise<InsertOneResult<T>>
    static insertMany(documents: (Document & T)[]): Promise<InsertManyResult<T>>

    static updateOne(
        filter: Filter<T>,
        update: UpdateFilter<T>
    ): Promise<UpdateResult>
    static updateMany(
        filter: Filter<T>,
        update: UpdateFilter<T>
    ): Promise<UpdateResult>

    static deleteOne(filter: Filter<T>): Promise<DeleteResult>
    static deleteMany(filter: Filter<T>): Promise<DeleteResult>

    static type<M>(model: M): Model<M>
}
