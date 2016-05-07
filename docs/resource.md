# Resource
`rest-io` supports adding custom actions on resources.

## Quick Start
To create a Custom Resource you extend the Resource class:

```javascript
import { Resource } from 'rest-io';

export default class BananaResource extends Resource {
  ...
}
```

Now you can overwrite the standard calls:

```javascript
export default class BananaResource extends Resource {
  getAll(req, res) {
    res.status(200).send('awesome!');
  }
}
```

## API
These are the functions you can overwrite or use:

### getAll(req, res, next)
This is the callback of the [express route handler](http://expressjs.com/guide/routing.html).

### getById(req, res, next)
This is the callback of the [express route handler](http://expressjs.com/guide/routing.html).

### create(req, res, next)
This is the callback of the [express route handler](http://expressjs.com/guide/routing.html).

### update(req, res, next)
This is the callback of the [express route handler](http://expressjs.com/guide/routing.html).

### del(req, res, next)
This is the callback of the [express route handler](http://expressjs.com/guide/routing.html).

### errorHandler(error, res)
The error that is triggered and the express `res` object to handle the result.

### setupRoutes()
Make use of `this.router` to setup new routes.
