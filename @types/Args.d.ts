import { Auth } from "../auth/Auth"

type StringPairs = Record<string, string>

export type Args<
    Body extends StringPairs = {},
    Params extends StringPairs = {},
    Query extends StringPairs = {}
> = {
    body: Body & {
        require<Property extends keyof Body>(property: Property): Body[Property]
    }

    params: Params
    query: Query

    $: Response

    user: Auth
}

type Response = {
    status: number
    headers: { [k: string]: string }
}
