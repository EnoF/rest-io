import resource = require('../../../src/resource');
import Resource = resource.Resource;

var ref = new Resource({
  name: 'ref',
  model: {
    name: String
  }
});

export = ref;
