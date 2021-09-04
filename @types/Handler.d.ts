import { Anonymous, Auth } from "../models"
import { Args } from "./Args"

export type Handler<
    Body = {},
    Params = {},
    Query = {},
    User = Auth | Anonymous
> = (args: Args<Body, Params, Query, User>) => Promise<any>
