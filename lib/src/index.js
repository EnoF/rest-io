var resource = require('./resource');
var bodyParser = require('body-parser');
function restIO(app) {
    app.use(bodyParser.json());
    resource.registerApp(app);
    return resource;
}
module.exports = restIO;
