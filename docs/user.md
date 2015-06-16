# UserResource extends [AuthorizedResource](/docs/authorizedResource.md)
`rest-io` supports User authentication.

## Quick Start
To create a user resource:

```javascript
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var restIO = require('rest-io');
var UserResource = restIO.UserResource;
var user = new UserResource({
  name: 'user',
  model: {
    userName: String,
    password: String,
    roles: [{
      type: Schema.Types.ObjectId,
      ref: 'Role'
    }],
    // Add your additional user properties here
    personalGreeting: String
  }
});
```

## API
These are the functions you can overwrite or use:

### createRoleModel()
Creates a basic Role model, containing only the name of the Role.

### isSelf(req)
Checks if the logged in user is performing an action on it's own resource.

### login(req, res)
Logs a user in. The password is stored encrypted in the database. More information about [authorization](/docs/authentication.md). The credentials are passed via the json body:

```
{
  "userName": "EnoF",
  "password": "secret"
}
```
