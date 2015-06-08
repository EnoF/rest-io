var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var resource = require('../../src/resource');
var Resource = resource.Resource;
var Food = require('./food');
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
