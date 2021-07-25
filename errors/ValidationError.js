exports.ValidationError = class extends Error {
    errors = {}

    get #invalid() {
        return !!Object.keys(this.errors).length
    }

    constructor(errors = {}) {
        super("Validation Error")

        Object.keys(errors).forEach((field) => {
            const { valid, kind } = errors[field]
            if (valid === false) this.set(field, kind)
        })
    }

    set(field, kind, message = `error of kind "${kind}"`) {
        this.errors[field] = { kind, message }
        this.id = `validation.${JSON.stringify(this.errors)}`
        return this
    }

    throw() {
        if (this.#invalid) {
            throw this
        }
    }
}
