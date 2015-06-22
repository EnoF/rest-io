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
var restIO = require('rest-io');
var Resource = restIO.Resource;

var blog = new Resource({
  name: 'blog',
  model: {
    title: String,
    posts: [{
      message: String
    }]
  }
});

module.exports = blog;
```

**post resource**

```javascript
var restIO = require('rest-io');
var SubResource = restIO.SubResource;
var blog = require('./blog');

var post = new SubResource({
  name: 'post',
  parentResource: blog
});

module.exports = post;
```

Now the following urls are available:

Method | Url                              | Action
------ | -------------------------------- | ---------
GET    | /api/blogs                       | get all
POST   | /api/blogs                       | create
GET    | /api/blogs/:blogId               | get by id
PUT    | /api/blogs/:blogId               | update
DELETE | /api/blogs/:blogId               | delete
GET    | /api/blogs/:blogId/posts         | get all
POST   | /api/blogs/:blogId/posts         | create
GET    | /api/blogs/:blogId/posts/:postId | get by id
PUT    | /api/blogs/:blogId/posts/:postId | update
DELETE | /api/blogs/:blogId/posts/:postId | delete

## References style
With the following two files, the blog and post resource will be available:

**blog resource**

```javascript
var restIO = require('rest-io');
var Resource = restIO.Resource;

var blog = new Resource({
  name: 'blog',
  model: {
    title: String
  }
});

module.exports = blog;
```

**post resource**

```javascript
var restIO = require('rest-io');
var Resource = restIO.Resource;
var blog = require('./blog');
var Schema = require('mongoose').Schema;

var post = new SubResource({
  name: 'post',
  model: {
    message: String,
    blog: {
      type: Schema.Types.ObjectId,
      ref: 'Blog'
    }
  }
  parentResource: blog
});

module.exports = post;
```

Now the following urls are available:

Method | Url                              | Action
------ | -------------------------------- | ---------
GET    | /api/blogs                       | get all
POST   | /api/blogs                       | create
GET    | /api/blogs/:blogId               | get by id
PUT    | /api/blogs/:blogId               | update
DELETE | /api/blogs/:blogId               | delete
GET    | /api/blogs/:blogId/posts         | get all
POST   | /api/blogs/:blogId/posts         | create
GET    | /api/blogs/:blogId/posts/:postId | get by id
PUT    | /api/blogs/:blogId/posts/:postId | update
DELETE | /api/blogs/:blogId/posts/:postId | delete
