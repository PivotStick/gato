const { ApiError } = require("./ApiError")

class ForbiddenError extends ApiError {
    constructor() {
        super("error.forbidden", 403, `Insufficient permissions`)
    }
}

exports.ForbiddenError = ForbiddenError
