const { ApiError } = require("./ApiError")

class InvalidType extends ApiError {
    constructor(type, value, path) {
        super(
            400,
            `\n\n\t${path} \x1b[0m= \x1b[31m${JSON.stringify(
                value
            )}\x1b[0m is not a valid \x1b[32m\x1b[1m${
                type.constructor.name
            }\n\x1b[0m`
        )
    }
}

exports.InvalidType = InvalidType
