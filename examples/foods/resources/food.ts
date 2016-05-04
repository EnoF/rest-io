import mongoose = require('mongoose');
import Schema = mongoose.Schema;
import resource = require('../../../src/resource');
import Resource = resource.Resource;

export const food = new Resource({
  name: 'food',
  model: {
    name: String,
    weight: Number
  }
});
