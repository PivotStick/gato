const { ApiError } = require("./ApiError")

class ForbiddenError extends ApiError {
    constructor() {
        super(403, `Insufficient permissions`)
    }
}

exports.ForbiddenError = ForbiddenError
