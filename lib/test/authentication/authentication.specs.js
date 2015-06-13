var Yadda = require('yadda');
Yadda.plugins.mocha.ScenarioLevelPlugin.init();
var mongoose = require('mongoose');
process.env.DB = 'customTest';
console.log('lol');
require('../../examples/authentication/app');
var library = require('./definitions/authentication.steps');
new Yadda.FeatureFileSearch('test/authentication').each(function (file) {
    featureFile(file, function (feature) {
        var yadda = Yadda.createInstance(library);
        afterEach(function (done) {
            mongoose.connection.db.dropDatabase(function (err, result) {
                done();
            });
        });
        scenarios(feature.scenarios, function (scenario, done) {
            yadda.run(scenario.steps, done);
        });
    });
});
