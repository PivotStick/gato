export * from "./App"
export * from "./Method"
export * from "./Controller"
export * from "./ControllerFile"
export * from "./Args"

import { TypeDef } from "./TypeDef"
import { Paths } from "./Paths"
import { Mongo } from "./Mongo"
import { Models } from "./Models"

declare global {
    namespace NodeJS {
        interface Global {
            types: Map<T, TypeDef<T>>
            paths: Paths
            mongo: Mongo
            models: Models
        }
    }
}
