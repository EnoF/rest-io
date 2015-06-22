import SubResource = require('../../../src/subResource');
import parent = require('./parent');

var sub = new SubResource({
  name: 'sub',
  parentResource: parent
});

module.exports = sub;
