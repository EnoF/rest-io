var authorizedResource_1 = require('../../../src/authorizedResource');
var parentResource = new authorizedResource_1.AuthorizedResource({
    name: 'parent',
    model: {
        name: String,
        subs: [{
                name: String
            }]
    }
});
module.exports = parentResource;
