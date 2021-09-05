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

    get raw() {
        return this.value
    }

    /**
     * @param {(before: any, after: any) => boolean} _validator
     */
    static set validator(_validator) {
        $$types.set(this, {
            _insert: (v) => new this(v).raw,
            _validator,
        })
    }
}
