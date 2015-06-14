import express = require('express');
import resource = require('./resource');
import bodyParser = require('body-parser');
import mongoose = require('mongoose');
import Mongoose = mongoose.Mongoose;
var autoloader = require('auto-loader');

function restIO(app: express.Application, config?: IRestIOConfig) {
  app.use(bodyParser.json());
  resource.registerApp(app, config.db);
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
  db?: Mongoose
}

export = restIO;
