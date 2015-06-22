var AuthorizedSubResource = require('../../../src/authorizedSubResource');
var parent = require('./parent');
var sub = new AuthorizedSubResource({
    name: 'sub',
    parentResource: parent
});
module.exports = sub;
