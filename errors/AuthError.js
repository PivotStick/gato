const { ApiError } = require("./ApiError")

class AuthError extends ApiError {
    constructor(identifierKey) {
        super(
            "error.auth.unidentified",
            401,
            `Wrong ${identifierKey} or password`
        )
    }
}

exports.AuthError = AuthError
