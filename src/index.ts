import express = require('express');
import resource = require('./resource');
import bodyParser = require('body-parser');
var autoloader = require('auto-loader');

function restIO(app: express.Application, config?: IRestIOConfig) {
  app.use(bodyParser.json());
  resource.registerApp(app);
  if (!!config) {
    var resources: Object = autoloader.load(config.resources);
    for (var i in resources) {
      if (resources.hasOwnProperty(i)) {
        resources[i];
      }
    }
  }
  return resource;
}

interface IRestIOConfig {
  resources: string;
}

export = restIO;
