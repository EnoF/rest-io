"use strict";
var resource = require('./resource');
var resource_1 = require('./resource');
var bodyParser = require('body-parser');
var userResource_1 = require('./userResource');
var authorizedResource = require('./authorizedResource');
var authorizedResource_1 = require('./authorizedResource');
var subResource_1 = require('./subResource');
var authorizedSubResource_1 = require('./authorizedSubResource');
var autoloader = require('auto-loader');
var RestIO = (function () {
    function RestIO(app, config) {
        app.use(bodyParser.json());
        resource.registerApp(app, config.db);
        if (!!config) {
            var resources = autoloader.load(config.resources);
            for (var i in resources) {
                if (resources.hasOwnProperty(i)) {
                    resources[i];
                }
            }
        }
        return resource;
    }
    RestIO.authorizedResource = authorizedResource;
    RestIO.UserResource = userResource_1.default;
    RestIO.AuthorizedResource = authorizedResource_1.default;
    RestIO.SubResource = subResource_1.default;
    RestIO.AuthorizedSubResource = authorizedSubResource_1.default;
    RestIO.Resource = resource_1.Resource;
    RestIO.ROLES = authorizedResource_1.ROLES;
    return RestIO;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RestIO;
