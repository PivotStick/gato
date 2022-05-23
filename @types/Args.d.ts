export interface Args<Body = {}> {
  $: {
    status: number
    headers: Map<string, string>
  }

  body: Body & import("../Body").default<Body>

  params: Record<string, string>
  query: URLSearchParams

  user: Gatos.Args["user"]
}
