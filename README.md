# SLASH

`npm install @slash`

or

`yarn add @slash`

## Overview

This library will make your life easy, just for fun!

**users.controller.js** example of a full controller file

```js
// no imports, no exports needed

// get endpoints
this.get = {
    "/ #get-all-users": async () => {
        /** ... */
        return []
    }

    "/:_id #get-by-id": async ({ params }) => {
        /** ... */
        return params
    }
}

this.post = {
    /**
     * @description create a new user
     */
    "/ #create": async ({ body }) => {
        /** ... */
    }
}

this.delete = {
    /**
     * This one is using a middleware named "checkAuth",
     * by using this syntax before the route path, it will
     * automatically search for the "checkAuth.js" file in the
     * declared middlewares path folder (read the quickstart to see how)
     *
     * @description delete a user using the "params.id"
     */
    "@checkAuth /:id #delete-by-id": async ({ params }) => {
        /** ... */
    }
}
```

## Quick start

```js
const { App } = require("@slash")

new App({
    [__dirname]: {
        routes: null,
        middlewares: null,
        security: null,
    },
}).listen(3500)
// Optional port argument
// 7070 by default
```

You can change the controllers name folder.
The middlewares folder can also be changed.

```js
const App = require("@slash")

const options = {
    dirNames: {
        middlewares: "functions",
        routes: "resolvers",
        security: "roles",
    },
}

new App(
    {
        [__dirname]: {
            resolvers: null,
            functions: null,
            roles: null,
        },
    },
    options
).listen()
```

# have fun!
