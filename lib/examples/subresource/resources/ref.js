var resource = require('../../../src/resource');
var Resource = resource.Resource;
var ref = new Resource({
    name: 'ref',
    model: {
        name: String
    }
});
module.exports = ref;
