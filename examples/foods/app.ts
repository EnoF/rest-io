import express = require('express');
import restIO = require('../../src/index');
import mongoose = require('mongoose');
var app = express();
var port = 3000;
restIO(app);

var mongoUrl = 'mongodb://localhost:27017/' + (process.env.DB || 'foods');
mongoose.connect(mongoUrl);

var Food = require('./food');
var List = require('./list');
var Fruit = require('./fruit');

app.listen(port, () => {
  console.log('Server has started under port: ' + port);
  console.log('Resources loaded:');
  console.log(Food.url);
  console.log(List.url);
  console.log(Fruit.url);
});

export = app;
