var resource = require('./resource');
var bodyParser = require('body-parser');
var autoloader = require('auto-loader');
function restIO(app, config) {
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
module.exports = restIO;
