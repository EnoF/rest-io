import AuthorizedSubResource = require('../../../src/authorizedSubResource');
import parent = require('./parent');

var sub = new AuthorizedSubResource({
  name: 'sub',
  parentResource: parent
});

module.exports = sub;
