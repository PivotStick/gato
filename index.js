require("./initGlobal")

module.exports = {
    ...require("./app"),
    ...require("./model"),
    ...require("./auth/Auth"),
}
