"use strict";
var resource = require('../../../src/resource');
var Resource = resource.Resource;
exports.food = new Resource({
    name: 'food',
    model: {
        name: String,
        weight: Number
    }
});
