# AuthorizedSubResource extends [AuthorizedResource](/docs/authorizedResource.md)
`rest-io` supports Authorized Resources. The [UserResource](/docs/user.md) is mandatory to enable authorized resources.

## Quick Start
To create an Authorized Parent Resource:

```javascript
import { AuthorizedResource } from 'rest-io';

export const blog = new AuthorizedResource({
  name: 'blog',
  model: {
    title: String,
    posts: [{
      message: String
    }]
  }
});
```

To create a sub resource for the posts:

```javascript
import { AuthorizedSubResource } from 'rest-io';
import blog from './blog';

export const posts = new AuthorizedSubResource({
  name: 'post',
  parentResource: blog
});
```

## API
The Authorized Sub Resource allows you to easily configure per method what roles have access to them.

### createProjectionQuery(req)
Returns a [projection query](http://docs.mongodb.org/manual/reference/method/db.collection.find/#db.collection.find) object.
Used during getting a single sub resource.

### createPullQuery(req)
Returns a [$pull query](http://docs.mongodb.org/manual/reference/operator/update/pull/) object.
Used during deleting a sub resource.

### createFindQuery(req)
Returns a query to single out the sub resource within it's parent. Used during updating a sub resource.

### createSubUpdate(req)
Returns a [$set query](http://docs.mongodb.org/manual/reference/operator/update/set/) object.
Used during updating a sub resource.
