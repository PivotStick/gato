export type TypeDef<T> = {
    _constructor: (value: any) => T
    validator: (before: any, after: T) => boolean
}
