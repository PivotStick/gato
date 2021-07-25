import { Args } from "./Args"

export type Controller<Body = {}, Params = {}, Query = {}> = (
    args: Args<Body, Params, Query>
) => Promise<any>
