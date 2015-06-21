var SubResource = require('../../../src/subResource');
var parent = require('./parent');
var sub = new SubResource({
    name: 'sub',
    parentResource: parent
});
module.exports = sub;
