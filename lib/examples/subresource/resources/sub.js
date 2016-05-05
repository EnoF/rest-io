"use strict";
var subResource_1 = require('../../../src/subResource');
var parent_1 = require('./parent');
exports.sub = new subResource_1.default({
    name: 'sub',
    parentResource: parent_1.parentResource,
    populate: 'subs.ref'
});
