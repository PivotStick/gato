const { createServer } = require("http")
const { lookup } = require("mime-types")
const { readFile, writeFile } = require("fs").promises
const { routes } = require("../routes")
const { join } = require("path")
const debug = require("../debug")
const { readFileSync } = require("fs")
const { parse } = require("comment-parser")

const server = createServer(async (req, res) => {
  const path = join(__dirname, "../doc", req.url.replace(/\/$/, "/index.html"))
  try {
    const file = await readFile(path)

    res.setHeader("content-type", lookup(path))
    res.end(file)
  } catch (error) {
    res.statusCode = 404
    res.end()
  }
})

exports.openDocServer = ({
  port = 4321,
  title = "Gatos DOC",
  description = "Documentation for Gatos app",

  urls = [],
} = {}) =>
  new Promise(async (resolve, reject) => {
    const routesPath = require("../routes").routesPath
    const mapped = Object.entries(routes).reduce((a, [method, endpoints]) => {
      let file = ""
      /** @type {import("comment-parser").Block[]} */
      let blocks = null
      endpoints.forEach(([path, details]) => {
        const fullPath = join(routesPath, details.base + ".js")
        file = file || readFileSync(fullPath, "utf-8")

        blocks = blocks || parse(file, { spacing: "preserve" })

        const block = blocks.find((block) =>
          block.tags.find(
            (tag) => tag.tag === "for" && tag.name === details.actionName
          )
        )

        const endpoint = {
          path: details.raw,
          name: details.actionName,
          method,
          block,
        }

        const item =
          a.find((_) => _.name === details.base) ||
          a.push({
            name: details.base,
            endpoints: [endpoint],
          })

        if (typeof item === "object") item.endpoints.push(endpoint)
      })
      return a
    }, [])
    await writeFile(
      join(__dirname, "../doc/doc.json"),
      JSON.stringify({
        title,
        description,
        urls: urls.map((url) => url.href),
        routes: mapped,
      })
    )

    server
      .listen(port, () => {
        debug.log(
          `\x1b[34m\x1b[3m@doc\x1b[0m \x1b[4m\x1b[3mhttp://locahost:${port}\x1b[0m`
        )
        resolve(arguments[0])
      })
      .on("error", reject)
  })
