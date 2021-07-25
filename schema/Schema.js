const { ValidationError } = require("../errors/ValidationError")

exports.Schema = class {
    #schema = {}

    constructor(schema) {
        this.#schema = schema
    }

    validate(values) {
        const result = validate(values, this.#schema)
        if (result.constructor === ValidationError) {
            result.throw()
        }
    }
}

const validate = (
    values,
    schema,
    path = "",
    errors = new ValidationError()
) => {
    const types = global.types

    if (schema.constructor === Array) {
        if (values.constructor !== Array)
            return errors.set(
                path,
                "invalid",
                `${JSON.stringify(values)} is not an Array`
            )

        values.forEach((v, i) => {
            const res = validate(v, schema[0], `${path}[${i}]`, errors)
            if (res.constructor !== ValidationError) values[i] = res
        })

        return errors
    }

    if (schema.constructor === Object) {
        if (values.constructor !== Object)
            return errors.set(
                path,
                "invalid",
                `${JSON.stringify(values)} is not an Object`
            )

        Object.keys(values).forEach((key) => {
            const type = schema[key]

            if (type === undefined) return delete values[key]

            const res = validate(
                values[key],
                type,
                `${path}.${key}`.replace(/^\./, ""),
                errors
            )

            if (res.constructor !== ValidationError) values[key] = res
        })

        return errors
    }

    if (!types.has(schema.constructor))
        throw new TypeError(
            `type \x1b[32m"${schema}"\x1b[0m is not a valid type\n\n\tvalid types -> \x1b[1m[${Object.keys(
                types.keys()
            ).join(", ")}]\x1b[0m\n`
        )

    const { _constructor, validator } = types.get(schema.constructor)
    const after = _constructor
        ? _constructor(values)
        : new schema.constructor(values)

    if (!validator(values, after))
        return errors.set(
            path,
            "invalid",
            `${JSON.stringify(values)} is not a ${schema.constructor.name}`
        )

    return after
}
