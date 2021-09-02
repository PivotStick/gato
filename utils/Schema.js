const { InvalidType } = require("../errors")

class Schema {
    constructor(schema, name = "Schema") {
        this.schema = schema
        this.name = name
    }

    #validate(schema, values, path = `\x1b[32m${this.name}\x1b[0m`) {
        const throwError = () => {
            throw new InvalidType(schema, values, path)
        }

        if (schema.constructor === Object) {
            if (values.constructor !== Object) throwError()

            for (const key in values) {
                if (!(key in schema)) {
                    delete values[key]
                    continue
                }

                const type = schema[key]
                const value = values[key]

                values[key] = this.#validate(
                    type,
                    value,
                    `${path}.\x1b[34m${key}\x1b[0m`
                )
            }

            return values
        }

        if (schema.constructor === Array) {
            if (values.constructor !== Array) throwError()

            const type = schema[0]
            values.forEach((v, i) => {
                values[i] = this.#validate(
                    type,
                    v,
                    `${path}[\x1b[33m${i}\x1b[0m]`
                )
            })

            return values
        }

        const { _validator, _constructor = (v) => new schema.constructor(v) } =
            global.types.get(schema.constructor)

        const after = _constructor(values)
        const isValid = _validator(values, after)

        if (!isValid) throwError()

        return after
    }

    validate(values) {
        this.#validate(this.schema, values)
        return values
    }
}

exports.Schema = Schema
