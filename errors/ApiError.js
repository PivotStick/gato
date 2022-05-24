class ApiError {
    /**
     * @param {string} id
     * @param {number} status
     * @param {string} message
     */
    constructor(id, status = 400, message = "BAD REQUEST") {
        this.id = id
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
