import { Auth } from "."

export class Anonymous extends Auth {
    readonly _id = -1
    readonly profiles = ["anonymous"] as const
}
