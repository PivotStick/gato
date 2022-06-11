```js
const gatos = require("gatos")

gatos.routes = "./routes"
gatos.uploadDir = "../public/uploads"

gatos.documentation = { title: "My auto generated doc" }

gatos.clear.listen()
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
    "/ #get-all": async () => {
        /** ... */
        return []
    }

    /**
     * @type {import("gatos/@types").Controller<{}, { _id: string }>}
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
     * @description delete a book using the "params.id"
     */
    "/:id #delete-by-id": async ({ params }) => {
        /** ... */
    }
}
```

## Quick start

`src/index.js`

```js
const gatos = require("gatos")

// This generate absolute paths relative to this file
gatos.routes = "./routes" // "/Users/username/project/src/routes"
gatos.uploadDir = "../public/uploads" // "/Users/username/project/public/uploads"

gatos.listen(3500)
// Optional port argument
// 8080 by default
```

# Roles

By default you are an anonymous, the anonymous has no roles.
But you can change it with the `gatos.roles` map object.

### Example

`src/index.js`

```js
const gatos = require("gatos")

// (Use this for admin)
gatos.roles.set("anonymous", "*") // it now has ALL roles on ALL ACTIONS of ALL CONTROLLERS

gatos.routes = "./routes"

// Clears the console before listening
gatos.clear.listen()
```

see ? simple.

let's move to his own file now
you can create new roles

`src/security/roles.js`

```js
const { roles } = require("gatos")
roles.set("anonymous", {
  auth: "*",
})

roles.set("default", {
  auth: {
    "*": true,
    "create-account": false,
  },
})

roles.set("user", {
  books: {
    "get-all": true,
    "get-by-id": true,
    "create-one": false,
  },
})

roles.set("author", {
  books: "*",
})

roles.set("admin", "*")
```

to use the new roles, you need to declare profiles

`src/security/profiles.js`

```js
const { profiles } = require("gatos")

profiles.set("user", ["default", "user"])
profiles.set("author", ["default", "author"])
```

profiles can have many specific roles!

```js
const gatos = require("gatos")

// Load the configs!
require("./security/roles")
require("./security/profiles")

gatos.routes = "./routes"
gatos.models = "./models"

gatos.clear.listen()
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
        const book = await Book.findOne(params)

        console.log(book.toString(), "found!")

        return book
    }
}

$$.post = {
    /**
     * @description create a new book
     * @type {import("gatos/@types").Controller<{ name: string, pages: string[] }>}
     */
    "/ #create": async ({ body }) => {
        // Will throw an error if not present in body
        body.$require("name")
        // Will use the default value if not present in body
        body.$require("pages", [])

        return await Book.insertOne(body)
    }
}

$$.delete = {
    /**
     * @description delete a book using the "params.id"
     */
    "/:_id #delete-by-id": async ({ params }) => {
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
 * The `Auth` class is important,
 * it will let know gatos to use
 * this class to find who you are
 * with the json web token
 */
module.exports = class User extends Auth {
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
  /** @type {import("gatos/@types").Controller<{ username: string, password: string }>} */
  "/login #login": ({ body }) =>
    User.login({
      username: body.$require("username"),
      password: body.$require("password"),
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
    return User.register({
      profiles: ["user"],

      username: body.$require("username"),
      firstName: body.$require("firstName"),
      lastName: body.$require("lastName"),
      password: body.$require("password"),
    })
  },
}
```

cool!

but I prefer "email" as the identifier and not "username"
_simple!_

`src/models/User.js`

```js
const { Auth } = require("gatos/models")
process.env.GATOS_USER_IDENTIFIER_KEY = "email"

module.exports = class User extends Auth {
  email = String.prototype

  firstName = String.prototype
  lastName = String.prototype

  get fullName() {
    return `${this.firstName} ${this.lastName}`
  }
}
```

I want validation for my emails >:(
Well...

# Types

`src/types/Email.js`

```js
const { Type } = require("gatos/types")

/**
 * This class now inherit a constructor(public value)
 * and a getter called "raw" used to JSON response serialization
 */
module.exports = class Email extends Type {
  /**
   * @param {string} email
   * @param {string} message
   */
  sendTo(email, message) {
    console.log(`Sending ${message} to ${email} from ${this.value}!`)
  }
}

/**
 * Thats a pretty cool regex 😎
 */
Email.validator = (v) => /emailregex/.test(v)
```

`src/models/User.js`

```js
const { Auth } = require("gatos/models")
const Email = require("../types/Email")

module.exports = class User extends Auth {
  /**
   * as simple as that
   * it will be instantiated when you get
   * the document so you can use methods and all
   * but serialized on server response (Email.raw getter)
   */
  email = Email.prototype

  firstName = String.prototype
  lastName = String.prototype

  static get $$identifierKey() {
    return "email"
  }

  get fullName() {
    return `${this.firstName} ${this.lastName}`
  }
}
```

Let's see...

`src/routes/auth.js`

```js
const User = require("../models/User")

$$.get = {
  "/ #get-current-user": ({ user }) => user,
}

$$.post = {
  /** @type {import("gatos/@types").Controller<{ message: string }, "email">} */
  "/emails/:email #send-email-to": ({ user, body, params }) => {
    const message = body.$require("message")
    user.email.sendTo(params.email, message) // console.log(`${message} to ${email} from ${this.value}!`)

    return user // the "email" property will be the "email.raw" automatically
  },

  /** ... */
}
```

# have fun!
