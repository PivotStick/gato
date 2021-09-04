import { Db } from "mongodb"
import { Profiles } from "./Profiles"
import { Roles } from "./Roles"
import { Auth } from "../models"
import { $$ } from "./$$"

declare global {
    const $$: $$
    const $$db: Db

    const $$types: Map<
        object,
        {
            _constructor?: (v: any) => any
            _validator: (before: any, after: any) => boolean
        }
    >

    const $$paths: {
        [K in "middlewares" | "routes"]: string
    }

    const $$roles: Roles
    const $$profiles: Profiles

    const $$User: typeof Auth
}
