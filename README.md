```js
const { App } = require("gatos")

App.middlewares = "./middlewares"
App.routes = "./routes"
App.files = "../public/uploads"

App.clear.listen()
```

```js
$$.get = {
    "/ #hello-world": () => "Hello World",
}
```

```js
const { Model } = require("gatos/models")

module.exports = class Book extends Model {
    title = String.prototype
}
```

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

`src/index.js`

```js
const { App } = require("gatos")

// This generate absolute paths relative to this file
App.routes = "./routes" // "/Users/username/project/src/routes"
App.middlewares = "./middlewares" // "/Users/username/project/src/middlewares"
App.files = "../public/uploads" // "/Users/username/project/public/uploads"

App.listen(3500)
// Optional port argument
// 7070 by default
```

You can change the folders name.

`src/index.js`

```js
const { App } = require("gatos")

App.routes = "../resolvers"
App.middlewares = "../sub_folder/functions"

App.listen()
```

# Rights

By default you are an anonymous, the anonymous has no rights.
But you can change it with the `$$rights` global object.

### Example

`src/index.js`

```js
const { App } = require("gatos")

// (Use this for admin)
$$rights.anonymous = "*" // it now has ALL RIGHTS on ALL ACTIONS of ALL CONTROLLERS

App.routes = "./routes"
App.middlewares = "./routes"

// Clears the console before listening
App.clear.listen()
```

see ? simple.

let's move to his own file now
you can create new rights

`src/security/rights.js`

```js
$$rights.anonymous = {
    auth: "*",
}

$$rights.default = {
    auth: {
        "*": true,
        "create-account": false,
    },
}

$$rights.user = {
    books: {
        "get-all": true,
        "get-by-id": true,
        "create-one": false,
    },
}

$$rights.author = {
    books: "*",
}

$$rights.admin = "*"
```

to use the new rights, you need to declare profiles

`src/security/profiles.js`

```js
$$profiles.user = ["default", "user"]
$$profiles.author = ["default", "author"]
```

profiles can have many specific rights!

```js
const { App } = require("gatos")

// Load the configs!
require("./security/roles")
require("./security/profiles")

App.routes = "./routes"
App.middlewares = "./routes"

App.clear.listen()
```

# Models

it is also very easy to create models for the mongodb!
let's create a model folder
where we create the **Book** model

`src/models/Book.js`

```js
const { Model } = require("gatos/models")

// This is a normal js class, nothing is transformed
// So you can make complex inheritance and create your
// own static methods on each models, also works for
// instance methods

// This class also act as a Validation Schema
// No required properties but only the defined
// properties will be accepted, it will throw
// an error if it's not a valid value for a property
module.exports = class Book extends Model {
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

# Auth

Let's create a user

`src/models/User.js`

```js
const { Auth } = require("gatos/models")

/**
 * The `$$User` part is important,
 * it will let know gatos to use
 * this class to find who you are
 * with the json web token
 */
$$User = module.exports = class User extends Auth {
    username = String.prototype

    firstName = String.prototype
    lastName = String.prototype

    get fullName() {
        return `${this.firstName} ${this.lastName}`
    }
}
```

`src/routes/auth.js`

```js
const User = require("../models/User")

$$.get = {
    "/ #get-current-user": ({ user }) => user,
}

$$.post = {
    /** @type {import("gatos").Handler<{ username: string, password: string }>} */
    "/login #login": ({ body }) =>
        User.login({
            identifier: body.require("username"),
            password: body.require("password"),
        }),

    /**
     * @type {import("gatos").Handler<{
     *  username: string
     *  lastName: string
     *  firstName: string
     *  password: string
     * }>}
     */
    "/register #create-account": ({ body }) => {
        body.require("username")
        body.require("firstName")
        body.require("lastName")
        body.require("password")

        return User.register(body)
    },
}
```

cool!

but I prefer "email" as the identifier and not "username"
_simple!_

`src/models/User.js`

```js
const { Auth } = require("gatos/models")

$$User = module.exports = class User extends Auth {
    email = String.prototype

    firstName = String.prototype
    lastName = String.prototype

    // OOP is cool right?
    // Just override the default getter, it was "username" by default :p
    static get $$identifierKey() {
        return "email"
    }

    get fullName() {
        return `${this.firstName} ${this.lastName}`
    }
}
```

# have fun!
