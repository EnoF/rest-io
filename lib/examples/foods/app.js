var express = require('express');
var restIO = require('../../src/index');
var mongoose = require('mongoose');
var app = express();
var port = 3000;
new restIO(app, {
    resources: __dirname + '/resources'
});
var host = process.env.MONGO_PORT_27017_TCP_ADDR || 'localhost';
var mongoUrl = 'mongodb://' + host + ':' + (process.env.MONGO_PORT || '27017') + '/';
mongoUrl += (process.env.DB || 'foods');
mongoose.connect(mongoUrl);
app.listen(port, function () {
    console.log('Server has started under port: ' + port);
});
module.exports = app;
