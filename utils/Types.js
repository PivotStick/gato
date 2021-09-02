class Types {
    static get(key) {
        const { _constructor = (v) => new key.constructor(v), ...rest } =
            global.types.get(key.constructor)

        return {
            ...rest,
            _constructor,
        }
    }
}

exports.Types = Types
