# Sub Resource
In `mongodb` there are two ways to define collections. Here is how you bind it in `rest-io`.

**Sub Document**

```json
{
  "_id": "idofthisblog",
  "title": "My Blog Name",
  "posts": [{
    "message": "message one"
  }, {
    "message": "message two"
  }]
}
```

vs

**References**

```json
{
  "_id": "idofthisblog",
  "title": "My Blog Name"
}
```

```json
[{
  "message": "message one",
  "blog": "idofthisblog"
}, {
  "message": "message two",
  "blog": "idofthisblog"
}]
```

## Sub Document Style
With the following two files, the blog and post resource will be available:

**blog resource**

```javascript
import { Resource } from 'rest-io';

export const blog = new Resource({
  name: 'blog',
  model: {
    title: String,
    posts: [{
      message: String
    }]
  }
});
```

**post resource**

```javascript
import { SubResource } from 'rest-io';
import blog from './blog';

export const post = new SubResource({
  name: 'post',
  parentResource: blog
});
```

Now the following urls are available:

Method | Url                              | Action
------ | -------------------------------- | ---------
GET    | /api/blogs                       | get all
POST   | /api/blogs                       | create
GET    | /api/blogs/:blogId               | get by id
PUT    | /api/blogs/:blogId               | update
DELETE | /api/blogs/:blogId               | delete
GET    | /api/posts                       | get all
GET    | /api/blogs/:blogId/posts         | get all
POST   | /api/blogs/:blogId/posts         | create
GET    | /api/blogs/:blogId/posts/:postId | get by id
PUT    | /api/blogs/:blogId/posts/:postId | update
DELETE | /api/blogs/:blogId/posts/:postId | delete

## References style
With the following two files, the blog and post resource will be available:

**blog resource**

```javascript
import { Resource } from 'rest-io';

const export blog = new Resource({
  name: 'blog',
  model: {
    title: String
  }
});
```

**post resource**

```javascript
import { Resource } from 'rest-io';
import blog from './blog';
import { Schema } from 'mongoose';

export const post = new SubResource({
  name: 'post',
  model: {
    message: String,
    blog: {
      type: Schema.Types.ObjectId,
      ref: 'Blog'
    }
  },
  parentResource: blog
});
```

Now the following urls are available:

Method | Url                              | Action
------ | -------------------------------- | ---------
GET    | /api/blogs                       | get all
POST   | /api/blogs                       | create
GET    | /api/blogs/:blogId               | get by id
PUT    | /api/blogs/:blogId               | update
DELETE | /api/blogs/:blogId               | delete
GET    | /api/posts                       | get all
GET    | /api/blogs/:blogId/posts         | get all
POST   | /api/blogs/:blogId/posts         | create
GET    | /api/blogs/:blogId/posts/:postId | get by id
PUT    | /api/blogs/:blogId/posts/:postId | update
DELETE | /api/blogs/:blogId/posts/:postId | delete
