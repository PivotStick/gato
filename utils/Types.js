class Types {
    static get(key) {
        const { _constructor = (v) => new key.constructor(v), ...rest } =
            $$types.get(key.constructor)

        return {
            ...rest,
            _constructor,
        }
    }
}

exports.Types = Types
