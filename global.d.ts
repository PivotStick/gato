import { Db } from "mongodb"
import { Profiles } from "./@types/Profiles"
import { Roles } from "./@types/Roles"
import { Auth } from "./models"

declare global {
    namespace NodeJS {
        export interface Global {
            db: Db

            types: Map<
                object,
                {
                    _constructor?: (v: any) => any
                    _validator: (before: any, after: any) => boolean
                }
            >

            paths: {
                [K in "middlewares" | "routes"]: string
            }

            roles: Roles
            profiles: Profiles

            User: typeof Auth
        }
    }
}
