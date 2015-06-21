import mongoose = require('mongoose');
import Schema = mongoose.Schema;
import resource = require('../../../src/resource');
import Resource = resource.Resource;

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