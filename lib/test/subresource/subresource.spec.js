"use strict";
var Yadda = require('yadda');
Yadda.plugins.mocha.ScenarioLevelPlugin.init();
var mongoose = require('mongoose');
process.env.DB = 'subTest';
require('../../examples/subresource/app');
var library = require('./definitions/sub.steps');
var parent_1 = require('../../examples/subresource/resources/parent');
new Yadda.FeatureFileSearch('test/subresource').each(function (file) {
    featureFile(file, function (feature) {
        var yadda = Yadda.createInstance(library);
        afterEach(function (done) {
            parent_1.parentResource.db.connection.db.dropDatabase(function (err, result) {
                done();
            });
        });
        scenarios(feature.scenarios, function (scenario, done) {
            yadda.run(scenario.steps, done);
        });
    });
});
