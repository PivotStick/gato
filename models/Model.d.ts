import {
    Collection,
    DeleteResult,
    Filter,
    InsertManyResult,
    InsertOneResult,
    UpdateFilter,
    UpdateResult,
} from "mongodb"
import { Only } from "../@types"

type Props<T> = Only<Omit<T, "$$privateKeys">, Function>

type UpdateOf<T> = UpdateFilter<Props<T>>
type FilterOf<T> = Filter<Props<T>>

type UpdateOfI<T> = UpdateOf<InstanceType<T>>
type FilterOfI<T> = FilterOf<InstanceType<T>>

export class Model {
    _id = ObjectId.prototype

    removePrivateKeys(): this
    update(update: UpdateOf<this> = {}): Promise<UpdateResult>
    delete(): Promise<DeleteResult>
    populate(path: string, removePrivateKeys = true): void

    get $$privateKeys(): keyof this[]

    static get $$name(): string

    static get $$collection<T extends typeof Model>(
        this: T
    ): Collection<Props<InstanceType<T>>>

    static insertOne<T extends typeof Model>(
        this: T,
        doc: Props<InstanceType<T>>
    ): Promise<InsertOneResult<InstanceType<T>>>

    static insertMany<T extends typeof Model>(
        this: T,
        docs: Props<InstanceType<T>>[]
    ): Promise<InsertManyResult<InstanceType<T>>>

    static async find<T extends typeof Model>(
        this: T,
        filter: FilterOf<InstanceType<T>>
    ): Promise<InstanceType<T>[]>

    static async findOne<T extends typeof Model>(
        this: T,
        filter: FilterOfI<T>
    ): Promise<InstanceType<T>>

    static updateOne<T extends typeof Model>(
        this: T,
        filter: FilterOfI<T>,
        update: UpdateOfI<T>
    ): Promise<UpdateResult>

    static updateMany<T extends typeof Model>(
        this: T,
        filter: FilterOfI<T>,
        update: UpdateOfI<T>
    ): Promise<UpdateResult>

    static deleteOne<T extends typeof Model>(
        this: T,
        filter: FilterOfI<T>
    ): Promise<DeleteResult>

    static deleteMany<T extends typeof Model>(
        this: T,
        filter: FilterOfI<T>
    ): Promise<DeleteResult>
}
