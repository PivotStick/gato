import { Controller } from "./Controller"

export type Method = {
    [path: string]: Controller
}
