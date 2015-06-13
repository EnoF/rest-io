import mongoose = require('mongoose');
import Schema = mongoose.Schema;
import UserResource = require('../../../src/userResource');

var user = new UserResource({
  name: 'user',
  model: {
    userName: String,
    password: String,
    roles: [{
      type: Schema.Types.ObjectId,
      ref: 'Role'
    }]
  }
});

export = user;
