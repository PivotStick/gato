/** @type {import("express").RequestHandler} */
exports.routeNotFound = (req, res, next) => {
    next({
        status: 404,
        message: "Route Not Found",
    })
}
