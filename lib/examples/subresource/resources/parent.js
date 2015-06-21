var resource = require('../../../src/resource');
var Resource = resource.Resource;
var parent = new Resource({
    name: 'parent',
    model: {
        name: String,
        subs: [{
                name: String
            }]
    }
});
module.exports = parent;
