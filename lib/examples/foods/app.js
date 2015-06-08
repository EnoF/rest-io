var express = require('express');
var restIO = require('../../src/index');
var mongoose = require('mongoose');
var app = express();
var port = 3000;
restIO(app);
var mongoUrl = 'mongodb://localhost:27017/' + (process.env.DB || 'foods');
mongoose.connect(mongoUrl);
var Food = require('./food');
var List = require('./list');
app.listen(port, function () {
    console.log('Server has started under port: ' + port);
    console.log('Resources loaded:');
    console.log(Food.url);
    console.log(List.url);
});
module.exports = app;
