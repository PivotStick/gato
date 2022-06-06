import { Model } from "classy-mongo"
import { InsertOneResult, UpdateResult } from "mongodb"

export { Model }

export class Auth extends Model {
  profiles: String[]

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
