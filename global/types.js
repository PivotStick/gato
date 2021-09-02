const { ObjectId } = require("mongodb")

global.types = new Map()

global.types.set(String, {
    _constructor: String,
    _validator: () => true,
})

global.types.set(Number, {
    _constructor: Number,
    _validator: (_, after) => !isNaN(after),
})

global.types.set(Date, {
    _validator: (_, after) => !isNaN(after.valueOf()),
})

global.types.set(ObjectId, {
    _validator: ObjectId.isValid,
})
