const { ObjectId } = require("mongodb")

globalThis.$$types = new Map()

$$types.set(String, {
    _constructor: String,
    _validator: () => true,
})

$$types.set(Number, {
    _constructor: Number,
    _validator: (_, after) => !isNaN(after),
})

$$types.set(Date, {
    _validator: (_, after) => !isNaN(after.valueOf()),
})

$$types.set(ObjectId, {
    _validator: ObjectId.isValid,
})
