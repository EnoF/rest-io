# AuthorizedResource extends [Resource](/docs/resource.md)
`rest-io` supports Authorized Resources. The [UserResource](/docs/user.md) is mandatory to enable authorized resources.

## Quick Start
To create an Authorized Resource:

```javascript
var restIO = require('rest-io');
var authorizedResource = restIO.authorizedResource;
var AuthorizedResource = restIO.AuthorizedResource;
var ROLES = authorizedResource.ROLES;

function BananaResource() { }

BananaResource.prototype = Object.create(AuthorizedResource.prototype, {
  ...
});
```

Now you can overwrite the standard calls and authorizations:

```javascript
BananaResource.prototype = Object.create(Resource.prototype, {
  permissions: IMethodAccess = {
    getAll: [ROLES.USER, ROLES.SUPER_USER, ROLES.MODERATOR, ROLES.ADMIN],
    getById: [ROLES.USER, ROLES.SUPER_USER, ROLES.MODERATOR, ROLES.ADMIN],
    create: [ROLES.MODERATOR, ROLES.ADMIN],
    update: [ROLES.MODERATOR, ROLES.ADMIN],
    del: [ROLES.ADMIN]
  };
});

var banana = new BananaResource({
  name: 'banana',
  model: {
    name: String
  }
});
```

## API
The Authorized Resource allows you to easily configure per method what roles have access to them.

### Roles
A set of string constants that you are free to adjust to your needs.

### permissions
Object defining the allowed roles. When an empty array of roles is provided, no authorization will be performed. This
allows users who are not logged in to access this resource.

#### getAll: Array<string>
Array of role names allowed to access.

#### getById: Array<string>
Array of role names allowed to access.

#### create: Array<string>
Array of role names allowed to access.

#### update: Array<string>
Array of role names allowed to access.

#### del: Array<string>
Array of role names allowed to access.
