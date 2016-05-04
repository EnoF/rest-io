"use strict";
var mongoose_1 = require('mongoose');
var resource_1 = require('../../../src/resource');
var food_1 = require('./food');
exports.dish = new resource_1.Resource({
    name: 'dish',
    model: {
        name: String,
        mainIngredient: {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Food'
        }
    },
    parentResource: food_1.food,
    parentRef: 'mainIngredient'
});
