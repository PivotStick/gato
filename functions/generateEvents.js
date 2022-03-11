const fs = require("fs")
const path = require("path")

/**
 * @param {import("socket.io").Server} io
 */
exports.generateEvents = (io) => {
    const files = fs.readdirSync($$paths.sockets)
    const listeners = files.map((file) => {
        const event = file.replace(/\.[^.]+$/, "")
        const fullPath = path.join($$paths.sockets, file)
        const listener = require(fullPath)

        if (typeof listener !== "function")
            throw new Error(`${fullPath} is not a function`)

        return { event, listener }
    })

    io.on("connection", (socket) => {
        for (const { event, listener } of listeners) {
            if (event === "connection") {
                listener(socket)
            } else {
                socket.on(event, listener)
            }
        }
    })
}
