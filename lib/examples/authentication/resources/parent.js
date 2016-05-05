"use strict";
var authorizedResource_1 = require('../../../src/authorizedResource');
exports.parentResource = new authorizedResource_1.default({
    name: 'parent',
    model: {
        name: String,
        subs: [{
                name: String
            }]
    }
});
