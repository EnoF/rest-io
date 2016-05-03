"use strict";
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var resource = require('../../../src/resource');
var Resource = resource.Resource;
var listResource = new Resource({
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
module.exports = listResource;
