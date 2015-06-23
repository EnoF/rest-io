var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var resource = require('../../../src/resource');
var Resource = resource.Resource;
var parentResource = new Resource({
    name: 'parent',
    model: {
        name: String,
        subs: [{
                name: String,
                ref: {
                    type: Schema.Types.ObjectId,
                    ref: 'Ref'
                }
            }]
    }
});
module.exports = parentResource;
