export type Options = {
    dirNames?: { [K in DirName]?: string }
    mongo?: {
        url?: string
    }
}
