import mongoose = require('mongoose');
import Schema = mongoose.Schema;
import resource = require('../../../src/resource');
import Resource = resource.Resource;
import Food = require('./food');

var dish = new Resource({
  name: 'dish',
  model: {
    name: String,
    mainIngredient: {
      type: Schema.Types.ObjectId,
      ref: 'Food'
    }
  },
  parentResource: Food
});

module.exports = dish;
