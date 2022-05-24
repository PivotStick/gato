const { ApiError } = require("./ApiError")

class RouteNotFound extends ApiError {
    constructor() {
        super("error.route_not_found", 404, "Route Not Found")
    }
}

exports.RouteNotFound = RouteNotFound
