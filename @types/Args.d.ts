import { Anonymous, Auth } from "../models"

export type Args<
    Body = {},
    Params = {},
    Query = {},
    Files = "",
    User = Auth | Anonymous
> = {
    user: User

    params: Params
    query: Query
    files: {
        [Name in Files]: {
            filename: string
            contentType: string
            data: Buffer
            /**
             * @param path relative path from the "App.files = "..."" specified path
             * @param filename name of the file, defaults to the real filename
             */
            upload(path?: string, filename: string): void
        }
    }

    body: Partial<Body> & {
        /**
         * This will throw an error if this key is not found in the body,
         * expect if the defaultValue is provided.
         *
         * @returns the value of the body's key
         */
        require<Key extends keyof Body>(
            key: Key,
            defaultValue?: Body[Key]
        ): Body[Key]
    }

    $: {
        status: number
    }
}
