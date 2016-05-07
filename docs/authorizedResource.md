# AuthorizedResource extends [Resource](/docs/resource.md)
`rest-io` supports Authorized Resources. The [UserResource](/docs/user.md) is mandatory to enable authorized resources.

## Quick Start
To create an Authorized Resource:

```javascript
import { AuthorizedResource, ROLES } from 'rest-io';

export default class BananaResource extends AuthorizedResource {
  ...
}
```

Now you can overwrite the standard calls and authorizations:

```javascript
export default class BananaResource extends AuthorizedResource {
  constructor() {
    this.permissions = {
      getAll: [ROLES.USER, ROLES.SUPER_USER, ROLES.MODERATOR, ROLES.ADMIN],
      getById: [ROLES.USER, ROLES.SUPER_USER, ROLES.MODERATOR, ROLES.ADMIN],
      create: [ROLES.MODERATOR, ROLES.ADMIN],
      update: [ROLES.MODERATOR, ROLES.ADMIN],
      del: [ROLES.ADMIN]
    };
  }
});

const banana = new BananaResource({
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
