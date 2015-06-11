var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var resource = require('../../../src/resource');
var Resource = resource.Resource;
var Food = require('./food');
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
