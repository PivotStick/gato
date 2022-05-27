const { ForbiddenError } = require("../errors")

const roles = new Map()
const profiles = new Map()

exports.roles = roles
exports.profiles = profiles

roles.set("anonymous", {})
profiles.set("anonymous", ["anonymous"])

/**
 * @param {string[]} userProfiles
 * @param {string} controller
 * @param {string} action
 */
exports.hasRights = (userProfiles, controller, action) => {
  for (let i = 0; i < userProfiles.length; i++) {
    const userProfile = userProfiles[i]
    const r = profiles.get(userProfile) || []

    for (let j = 0; j < r.length; j++) {
      const role = r[j]
      const schema = roles.get(role) || {}

      if (
        schema === "*" ||
        schema?.[controller] === "*" ||
        schema?.[controller]?.[action] === "*" ||
        schema?.[controller]?.[action] === true
      )
        return
    }
  }

  throw new ForbiddenError()
}
