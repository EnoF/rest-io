"use strict";
var mongoose_1 = require('mongoose');
var resource_1 = require('../../../src/resource');
exports.parentResource = new resource_1.Resource({
    name: 'parent',
    model: {
        name: String,
        subs: [{
                name: String,
                ref: {
                    type: mongoose_1.Schema.Types.ObjectId,
                    ref: 'Ref'
                }
            }]
    }
});
