export interface Args<Body = {}> {
  $: {
    status: number
    headers: Map<string, string>
  }

  body: Body & import("../Body").default<Body>
  files: Record<
    string,
    {
      filename: string
      contentType: string
      data: Buffer
      upload(path?: string, filename?: string): Promise<string>
    }
  >

  params: Record<string, string>
  query: URLSearchParams

  user: Gatos.Args["user"]
}
