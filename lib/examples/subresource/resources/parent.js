var resource = require('../../../src/resource');
var Resource = resource.Resource;
var parentResource = new Resource({
    name: 'parent',
    model: {
        name: String,
        subs: [{
                name: String
            }]
    }
});
module.exports = parentResource;
