import mongoose = require('mongoose');
import Schema = mongoose.Schema;
import resource = require('../../src/resource');
import Resource = resource.Resource;
import Food = require('./food');

var fruit = new Resource({
  name: 'fruit',
  model: {
    name: String,
    food: {
      type: Schema.Types.ObjectId,
      ref: 'Food'
    }
  },
  parentResource: Food
});

module.exports = fruit;
