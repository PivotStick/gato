const { ApiError } = require("./ApiError")

class UnknownError extends ApiError {
  /**
   * @param {Error} error
   */
  constructor(error) {
    super("unknown", 500, "Unknown Error")
    this.error = {
      ...error,
      message: error.message,
      name: error.name,
      stack: error.stack,
    }
  }
}

exports.UnknownError = UnknownError
