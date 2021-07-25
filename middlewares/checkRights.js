const { resolveProfiles } = require("../functions/profiles")

/**
 * @type {import("express").RequestHandler}
 */
exports.checkRights = (controller, action) => (req, res, next) => {
    if (!resolveProfiles(req.user.profiles, controller, action)) {
        next(new Error("You have no rights here"))
    }

    next()
}
