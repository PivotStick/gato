import { Auth, Anonymous } from "../models"

export type Args<
    Body = {},
    Params = {},
    Query = {},
    User extends Auth = Auth
> = {
    user: User | Anonymous

    params: Params
    query: Query

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
