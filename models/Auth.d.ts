import { InsertOneResult } from "mongodb"
import { Model, Props } from "./Model"

type Credentials = { identifier: string; password: string }
type Payload<T> = Props<Omit<InstanceType<T>, "_id">>

export class Auth extends Model {
    profiles = [String.prototype]

    password = String.prototype

    hasRole(role: string): boolean

    static async login(credentials: Credentials): Promise<string>

    static async register<T extends typeof Auth>(
        this: T,
        payload: Payload<T>
    ): Promise<InsertOneResult<InstanceType<T>>>
}
