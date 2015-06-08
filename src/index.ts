import express = require('express');
import resource = require('./resource');
import bodyParser = require('body-parser');

function restIO(app: express.Application) {
  app.use(bodyParser.json());
  resource.registerApp(app);
  return resource;
}

export = restIO;
