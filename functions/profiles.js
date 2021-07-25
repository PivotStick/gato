const { resolveRight } = require("./rights")
const { join } = require("path")

const singleton = (initializer, value) => {
    if (value === undefined) value = initializer()

    return value
}

const security = (kind, anonymous) =>
    singleton(() => ({
        anonymous,
        ...require(join(global.paths._security, kind)),
    }))

/**
 * @param {string} profile
 * @param {string} controller
 * @param {string} action
 * @returns {boolean}
 */
const resolveProfile = (profile, controller, action) => {
    const profiles = security("profiles", ["anonymous"])
    const rights = security("rights", {})

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
