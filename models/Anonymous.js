const { Auth } = require("./Auth")

class Anonymous extends Auth {
    _id = -1
    profiles = ["anonymous"]
}

exports.Anonymous = Anonymous
