const Yadda = require('yadda');
Yadda.plugins.mocha.ScenarioLevelPlugin.init();

import * as mongoose from 'mongoose';

process.env.DB = 'subTest';

require('../../examples/subresource/app');
const library = require('./definitions/sub.steps');

import { parentResource } from '../../examples/subresource/resources/parent';

new Yadda.FeatureFileSearch('test/subresource').each((file) => {
  featureFile(file, (feature) => {
    const yadda = Yadda.createInstance(library);

    afterEach((done) =>
      parentResource.db.connection.db
        .dropDatabase((err, result) => done()));

    scenarios(feature.scenarios, (scenario, done) => 
      yadda.run(scenario.steps, done));
  });
});
