import mongoose = require('mongoose');
import Schema = mongoose.Schema;
import resource = require('../../../src/resource');
import Resource = resource.Resource;

var foodResource = new Resource({
  name: 'food',
  model: {
    name: String
  }
});

export = foodResource;
