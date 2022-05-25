import { InsertOneResult, UpdateResult } from "mongodb"

export { Model } from "classy-mongo"

export class Auth extends Model {
  profiles = [String.prototype]

  updatePassword(password: string): Promise<UpdateResult>

  static register<T extends typeof Auth>(
    this: T,
    document: InstanceType<T> & { password: string }
  ): Promise<InsertOneResult<InstanceType<T>>>

  static login(
    credentials: {
      password: string
    } & Record<string, any>
  ): Promise<{
    token: string
    expiresAt: number
  }>
}
