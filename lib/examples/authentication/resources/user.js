"use strict";
var mongoose_1 = require('mongoose');
var userResource_1 = require('../../../src/userResource');
exports.user = new userResource_1.default({
    name: 'user',
    model: {
        userName: String,
        password: String,
        roles: [{
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'Role'
            }]
    }
});
