/** @type {import("express").ErrorRequestHandler} */
exports.errorHandler = (err, req, res, next) => {
    res.status(err.status || 400).json({
        status: res.statusCode,
        error: {
            message: err.message,
            ...err,
        },
    })
}
