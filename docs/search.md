# Search
Searching in `rest-io` routes the query to the mongoose `find`. `GET` query parameters are converted to
find parameters.

## query
The query is build from the `GET` parameters. You can provide a `regex` or a mongo `query operator`.

## recursive end points
Sub resources recursively adds end points to search. A `child` resource will expose an end point on
a `parent`, `grandparents` and on the `root` of the api.

End points:
- `/api/grandparents/:grandparentid/parents/:parentid/childs`
- `/api/grandparents/:grandparentid/childs` TODO
- `/api/childs`

## Examples
Resource: `/api/grandparents`

```json
[{
  "_id": "gp1",
  "firstName": "Tywin",
  "lastName": "Lannister",
  "age": 60
}, {
  "_id": "gp2",
  "firstName": "Joanna",
  "lastName": "Lannister",
  "age": 55
}]
```

### search by attribute
`/api/grandparents?firstName=Tywin`

```json
[{
  "_id": "gp1",
  "firstName": "Tywin",
  "lastName": "Lannister",
  "age": 60
}]
```

### search by attribute
`/api/grandparents?firstName=/tywin/i`

```json
[{
  "_id": "gp1",
  "firstName": "Tywin",
  "lastName": "Lannister",
  "age": 60
}]
```

### search by attribute with conditions
`/api/grandparents?age={"$gt":56}`

```json
[{
  "_id": "gp1",
  "firstName": "Tywin",
  "lastName": "Lannister",
  "age": 60
}, {
  "_id": "gp2",
  "firstName": "Joanna",
  "lastName": "Lannister",
  "age": 55
}]
```
