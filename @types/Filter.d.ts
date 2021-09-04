import { Only } from "./Only"

export type Filter<T> = Only<Omit<T, "$$privateKeys">, Function>
