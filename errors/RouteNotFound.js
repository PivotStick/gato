const { ApiError } = require("./ApiError")

class RouteNotFound extends ApiError {
    constructor() {
        super(404, "Route Not Found")
    }
}

exports.RouteNotFound = RouteNotFound
