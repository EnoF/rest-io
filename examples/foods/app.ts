import express = require('express');
import restIO = require('../../src/index');
import mongoose = require('mongoose');
var app = express();
var port = 3000;
restIO(app, {
  resources: __dirname + '/resources'
});

var mongoUrl = 'mongodb://localhost:27017/' + (process.env.DB || 'foods');
mongoose.connect(mongoUrl);

app.listen(port, () => {
  console.log('Server has started under port: ' + port);
  console.log('Resources loaded:');
});

export = app;
