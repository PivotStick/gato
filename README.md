# GATOS

`npm install gatos`

or

`yarn add gatos`

## Overview

This library will make your life easy, just for fun!

example of a full controller file

`src/routes/books.js`

```js
// no imports, no exports needed

// get endpoints
$$.get = {
    "/ #get-all-books": async () => {
        /** ... */
        return []
    }

    "/:_id #get-by-id": async ({ params }) => {
        /** ... */
        return params
    }
}

$$.post = {
    /**
     * @description create a new book
     */
    "/ #create": async ({ body }) => {
        /** ... */
    }
}

$$.delete = {
    /**
     * This one is using a middleware named "doSomeStuff",
     * by using this syntax before the route path, it will
     * automatically search for the "doSomeStuff.js" file in the
     * declared middlewares path folder (read the quickstart to see how)
     *
     * @description delete a book using the "params.id"
     */
    "@doSomeStuff /:id #delete-by-id": async ({ params }) => {
        /** ... */
    }
}
```

## Quick start

`src/index.js`

```js
const { App } = require("gatos")

// This generate absolute paths relative to this file
new App({
    routes: null, // "/Users/username/project/src/routes"
    middlewares: null, // "/Users/username/project/src/middlewares"
}).listen(3500)
// Optional port argument
// 7070 by default
```

You can change the folders name.

`src/index.js`

```js
const { App } = require("gatos")

const options = {
    dirNames: {
        middlewares: "functions",
        routes: "resolvers",
    },
}

const architecture = {
    resolvers: null,
    sub_folder: {
        functions: null,
    },
}

new App(architecture, options).listen()
```

# Rights

By default you are an anonymous, the anonymous has no rights.
But you can change it with the `rights` global object.

### Example

`src/index.js`

```js
const { App } = require("gatos")

// (Use this for admin)
rights.anonymous = "*" // it now has ALL RIGHTS on ALL ACTIONS of ALL CONTROLLERS

new App({
    routes: null,
    middlewares: null,
}).listen()
```

see ? simple.

let's move to his own file now
you can create new rights

`src/security/rights.js`

```js
rights.anonymous = {
    auth: "*",
}

rights.default = {
    auth: {
        "*": true,
        "create-account": false,
    },
}

rights.user = {
    books: {
        "get-all": true,
        "get-by-id": true,
        "create-one": false,
    },
}

rights.author = {
    books: "*",
}
```

to use the new rights, you need to declare profiles

`src/security/profiles.js`

```js
profiles.user = ["default", "user"]
profiles.author = ["default", "author"]
```

profiles can have many specific rights!

it is also very easy to create models for the mongodb!
let's create a model folder
where we create the **Book** model

`src/models/Book.js`

```js
const { Model } = require("gatos")

// This is a normal js class, nothing is transformed
// So you can make complex inheritance and create your
// own static methods on each models, also works for
// instance methods

// This class also act as a Validation Schema
// No required properties but only the defined
// properties will be accepted, it will throw
// an error if it's not a valid value for a property
class Book extends Model {
    // We use the prototype property so we can have
    // the types on instantiated documents
    // (You will see that you can create your own types with their own validator & constructor)
    name = String.prototype
    pages = [String.prototype]
    creationDate = Date.prototype

    get pageCount() {
        return this.pages.length
    }

    // You have to do this for the model to work
    // This constructor will be called when the document is fetched from the database
    // You can manipulate the raw data before it is parsed
    constructor(document) {
        super(Book)
        this.set(document)
    }

    static getSpecialBooks() {
        // default mongodb collection driver for this model
        // the collection name is automatically generated
        // using the class name
        return this.collection.find({
            name: { $regex: /special/i },
        })
    }
}

module.exports = Book
```

easyyyyy

now let's go back to the routes

`src/routes/books.js`

```js
const Book = require("../models/Book")

$$.get = {
    "/ #get-all-books": async () => {
        return await Book.find()
    }

    "/:_id #get-by-id": async ({ params }) => {
        return await Book.findOne(params)
    }
}

$$.post = {
    /**
     * @description create a new book
     */
    "/ #create": async ({ body }) => {
        // Will throw an error if not present in body
        body.require("name")
        body.require("pages")

        return await Book.insertOne(body)
    }
}

$$.delete = {
    /**
     * @description delete a book using the "params.id"
     */
    "@doSomeStuff /:_id #delete-by-id": async ({ params }) => {
        const { _id } = params
        return await Book.deleteOne({ _id })
    }
}
```

# have fun!
