var resource = require('./resource');
var bodyParser = require('body-parser');
function registerApp(app) {
    app.use(bodyParser.json());
    resource.registerApp(app);
    return resource;
}
module.exports = registerApp;
