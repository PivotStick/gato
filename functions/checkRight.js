require("../global")

/**
 * @param {string} role
 * @param {string} controller
 * @param {string} action
 * @returns {boolean}
 */
exports.checkRight = (role, controller, action) => {
    const controllers = $$roles[role] ?? {}
    if (controllers === "*") return true

    const actions = controllers[controller] ?? controllers["*"] ?? {}
    if (actions === "*") return true

    return actions[action] ?? actions["*"] ?? false
}
