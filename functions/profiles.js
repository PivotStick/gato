const { resolveRight } = require("./rights")

/**
 * @param {string} profile
 * @param {string} controller
 * @param {string} action
 * @returns {boolean}
 */
const resolveProfile = (profile, controller, action) => {
    for (const id of profiles[profile]) {
        const hasRights = resolveRight(rights[id], controller, action)
        if (hasRights) return true
    }

    return false
}

/**
 * @param {string[]} profiles
 * @param {string} controller
 * @param {string} action
 * @returns {boolean}
 */
exports.resolveProfiles = (profiles, controller, action) => {
    for (const profile of profiles) {
        if (resolveProfile(profile, controller, action)) return true
    }

    return false
}
