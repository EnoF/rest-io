import mongoose = require('mongoose');
import Schema = mongoose.Schema;
import resource = require('../../../src/resource');
import Resource = resource.Resource;

export const list = new Resource({
  name: 'list',
  populate: 'foods',
  model: {
    name: String,
    foods: [{
      type: Schema.Types.ObjectId,
      ref: 'Food'
    }]
  }
});
