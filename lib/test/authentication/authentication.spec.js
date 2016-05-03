"use strict";
var Yadda = require('yadda');
Yadda.plugins.mocha.ScenarioLevelPlugin.init();
var mongoose = require('mongoose');
process.env.DB = 'authTest';
require('../../examples/authentication/app');
var library = require('./definitions/authentication.steps');
var user_1 = require('../../examples/authentication/resources/user');
new Yadda.FeatureFileSearch('test/authentication').each(function (file) {
    featureFile(file, function (feature) {
        var yadda = Yadda.createInstance(library);
        afterEach(function (done) {
            user_1.user.db.connection.db.dropDatabase(function (err, result) {
                done();
            });
        });
        scenarios(feature.scenarios, function (scenario, done) {
            yadda.run(scenario.steps, done);
        });
    });
});
