import mongoose = require('mongoose');
import Schema = mongoose.Schema;
import BoomerangResource = require('../resourceDefinitions/boomerangResource');

var boomerang = new BoomerangResource({
  name: 'boomerang',
  model: {
    name: String
  }
});

module.exports = boomerang;
