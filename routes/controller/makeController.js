const { makeArg } = require("./makeArg")

/**
 * @typedef {{ $$status: number, [key: string]: any }} Response
 * @typedef {() => Promise<Response>} RequestHandler
 *
 * @param {RequestHandler} controller
 */
exports.makeController = (controller) => async (req, res, next) => {
    try {
        const result = await controller(makeArg(req, res))

        res.json({
            status: res.statusCode,
            result,
        })
    } catch (error) {
        next(error)
    }
}
