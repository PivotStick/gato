import { Args } from "./Args"

export type Controller<Body = {}> = (args: Args<Body>) => Promise<any>
