# GATOS

`npm install gatos`

or

`yarn add gatos`

## Overview

This library will make your life easy, just for fun!

example of a full controller file

`routes/books.js`

```js
// no imports, no exports needed

// get endpoints
$$.get = {
    "/ #get-all-books": async () => {
        /** ... */
        return []
    }

    /**
     * @type {import("gatos").Handler<{}, { _id: string }>}
     */
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

`index.js`

```js
const { App } = require("gatos")

// This generate absolute paths relative to this file
App.routes = "./routes" // "/Users/username/project/routes"
App.middlewares = "./middlewares" // "/Users/username/project/middlewares"

App.listen(3500)
// Optional port argument
// 7070 by default
```

You can change the folders name.

`index.js`

```js
const { App } = require("gatos")

App.routes = "../resolvers"
App.middlewares = "../sub_folder/functions"

App.listen()
```

# Rights

By default you are an anonymous, the anonymous has no rights.
But you can change it with the `global.rights` global object.

### Example

`index.js`

```js
const { App } = require("gatos")

// (Use this for admin)
global.rights.anonymous = "*" // it now has ALL RIGHTS on ALL ACTIONS of ALL CONTROLLERS

App.routes = "./routes"
App.middlewares = "./routes"

// Clears the console before listening
App.clear.listen()
```

see ? simple.

let's move to his own file now
you can create new rights

`security/rights.js`

```js
global.rights.anonymous = {
    auth: "*",
}

global.rights.default = {
    auth: {
        "*": true,
        "create-account": false,
    },
}

global.rights.user = {
    books: {
        "get-all": true,
        "get-by-id": true,
        "create-one": false,
    },
}

global.rights.author = {
    books: "*",
}

global.rights.admin = "*"
```

to use the new rights, you need to declare profiles

`security/profiles.js`

```js
global.profiles.user = ["default", "user"]
global.profiles.author = ["default", "author"]
```

profiles can have many specific rights!

it is also very easy to create models for the mongodb!
let's create a model folder
where we create the **Book** model

`models/Book.js`

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

    toString() {
        return `[${this.name}] - ${this.pageCount} pages`
    }

    static getSpecialBooks() {
        return this.find({
            name: { $regex: /special/i },
        })
    }
}

module.exports = Book
```

easyyyyy

now let's go back to the routes

`routes/books.js`

```js
const Book = require("../models/Book")

$$.get = {
    "/ #get-all-books": async () => {
        return await Book.find()
    }

    "/:_id #get-by-id": async ({ params }) => {
        /**
         * You now have typings!
         * @type {Book}
         */
        const book = await Book.findOne(params)

        console.log(book.toString(), "found!")

        return book
    }
}

$$.post = {
    /**
     * @description create a new book
     * @type {import("gatos").Handler<{ name: string, pages: string[] }>}
     */
    "/ #create": async ({ body }) => {
        // Will throw an error if not present in body
        body.require("name")
        // Will use the default value if not present in body
        body.require("pages", [])

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
