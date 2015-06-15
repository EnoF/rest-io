var resource = require('./resource');
var bodyParser = require('body-parser');
var UserResource = require('./userResource');
var authorizedResource = require('./authorizedResource');
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
    RestIO.UserResource = UserResource;
    RestIO.authorizedResource = authorizedResource;
    return RestIO;
})();
module.exports = RestIO;
