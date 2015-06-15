# API
API documentation for `rest-io`.

## restIO(app[, db])
Registers the app with `rest-io`. This allows `rest-io` to bind the routings automatically. The `bodyParser` module will be used to parse the `json` requests.

The `db` is required if you created an new instance of mongoose.

## new restIO.Resource(config)
Resources are routed automatically with the configuration provided. These configurations are provided to the `Resource` constructor.

Property       | Description                                                           | Type     | Default
-------------- | --------------------------------------------------------------------- | -------- | ----------
name           | The name of the resource                                              | String   | Mandatory
model          | The mongoose `Schema` config                                          | Schema   | Mandatory
parentRef      | The parent reference of the resource to be populated during retrieval | String   |
populate       | The children to populate, space separated                             | String   |
plural         | The plural form of the resource name                                  | String   | name + 's'
parentResource | The parent of this resource                                           | Resource |
