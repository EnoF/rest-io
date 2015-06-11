var express = require('express');
var restIO = require('../../src/index');
var mongoose = require('mongoose');
var app = express();
var port = 3000;
restIO(app, {
    resources: __dirname + '/resources'
});
var mongoUrl = 'mongodb://localhost:27017/' + (process.env.DB || 'foods');
mongoose.connect(mongoUrl);
app.listen(port, function () {
    console.log('Server has started under port: ' + port);
    console.log('Resources loaded:');
});
module.exports = app;
