var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var UserResource = require('../../../src/userResource');
var user = new UserResource({
    name: 'user',
    model: {
        userName: String,
        password: String,
        roles: [{
                type: Schema.Types.ObjectId,
                ref: 'Role'
            }]
    }
});
module.exports = user;
