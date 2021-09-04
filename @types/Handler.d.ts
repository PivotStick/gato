import { Anonymous, Auth } from "../models"
import { Args } from "./Args"

export type Handler<
    Body = {},
    Params = {},
    Query = {},
    Files = {},
    User = Auth | Anonymous
> = (args: Args<Body, Params, Query, Files, User>) => Promise<any>
