import { InsertOneResult } from "mongodb"

export { Model } from "classy-mongo"

export class Auth extends Model {
  profiles = [String.prototype]

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
