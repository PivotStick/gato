const { Auth, Anonymous } = require("../models")
const { checkProfile } = require("./checkProfile")

/**
 * @param {Auth | Anonymous} user
 * @param {string} controller
 * @param {string} action
 */
exports.checkUserAccess = (user, controller, action) => {
    for (let i = 0; i < user.profiles.length; i++) {
        const profile = user.profiles[i]
        if (checkProfile(profile, controller, action)) return true
    }

    return false
}
