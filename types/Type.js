/**
 * @template T
 */
exports.Type = class Type {
    /**
     * @param {T} value
     */
    constructor(value) {
        this.value = value
    }

    /**
     * @param {(before: any, after: any) => boolean} _validator
     */
    static set validator(_validator) {
        $$types.set(this, {
            _insert: (v) => new this(v).toJSON(),
            _validator,
        })
    }

    toJSON() {
        return this.value
    }
}
