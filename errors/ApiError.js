class ApiError {
    constructor(status = 400, message = "BAD REQUEST") {
        this.status = status
        this.message = message
    }

    get clean() {
        const { message, ...props } = this

        return {
            ...props,
            message: message.replace(/\x1b\[\d+m|[\n\t]+/g, ""),
        }
    }
}

exports.ApiError = ApiError
