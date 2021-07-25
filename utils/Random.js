exports.Random = class {
    static range(min, max) {
        return Math.floor(Math.random() * (max + 1 - min) + min)
    }

    static #getCharsFromRange(min, max, count) {
        const numbers = []
        for (let i = 0; i < count; i++) numbers[i] = this.range(min, max)
        return String.fromCharCode(...numbers)
    }

    static lowercase(count = 1) {
        return this.#getCharsFromRange(97, 122, count)
    }

    static uppercase(count = 1) {
        return this.#getCharsFromRange(65, 90, count)
    }

    static specialChar(count = 1) {
        const specialCharacters = ["@", "$", "!", "%", "#", "*", "?", "&"]

        let chars = ""
        for (let i = 0; i < count; i++) {
            const randomIndex = this.range(0, specialCharacters.length - 1)
            chars += specialCharacters[randomIndex]
        }

        return chars
    }
}
