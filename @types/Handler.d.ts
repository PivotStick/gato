import { Auth } from "../Auth"
import { Args } from "./Args"

export type Handler<
    Body = {},
    Params = {},
    Query = {},
    User extends Auth = Auth
> = (args: Args<Body, Params, Query, User>) => Promise<any>
