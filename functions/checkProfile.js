const { checkRight } = require("./checkRight")

/**
 * @param {string} profile
 * @param {string} controller
 * @param {string} action
 * @returns {boolean}
 */
exports.checkProfile = (profile, controller, action) => {
    const roles = $$profiles[profile] || []
    for (let i = 0; i < roles.length; i++) {
        const role = roles[i]
        if (checkRight(role, controller, action)) return true
    }

    return false
}
