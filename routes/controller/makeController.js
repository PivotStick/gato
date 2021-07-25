const { makeArg } = require("./makeArg")

/**
 * @param {() => Promise<any>} controller
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
