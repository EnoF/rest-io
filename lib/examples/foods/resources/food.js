var resource = require('../../../src/resource');
var Resource = resource.Resource;
var foodResource = new Resource({
    name: 'food',
    model: {
        name: String,
        weight: Number
    }
});
module.exports = foodResource;
