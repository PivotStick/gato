export type TypeDef<T> = {
    _constructor: (value: any) => T
    validator: (before: any, after: T) => boolean
}

export type FullPath = {
    path: string
    regex: RegExp
}

export type Paths = {
    [K in "_security" | "_routes" | "_middlewares"]: FullPath
}

export type DirName = "routes" | "middlewares" | "security"

export type Options = {
    dirNames?: { [K in DirName]?: string }
    mongo?: {
        url?: string
    }
}
