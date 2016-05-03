"use strict";
var authorizedSubResource_1 = require('../../../src/authorizedSubResource');
var parent_1 = require('./parent');
exports.sub = new authorizedSubResource_1.default({
    name: 'sub',
    parentResource: parent_1.parentResource
});
