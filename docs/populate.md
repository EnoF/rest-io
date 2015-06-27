# Populate
`rest-io` allows population controll via the `GET` parameter `populate`.

## Example

url                                         | description
------------------------------------------- | ---------------------------------------------
`/api/dish?populate=ingredients`            | will populate the ingredients.
`/api/dish?populate=ingredients inventedBy` | will populate the ingredients and inventedBy.
