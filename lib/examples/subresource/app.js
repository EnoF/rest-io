var express = require('express');
var restIO = require('../../src/index');
var mongoose = require('mongoose');
var app = express();
var port = 5050;
var host = process.env.MONGO_PORT_27017_TCP_ADDR || 'localhost';
var mongoUrl = 'mongodb://' + host + ':' + (process.env.MONGO_PORT || '27017') + '/';
var db = new mongoose.Mongoose();
mongoUrl += (process.env.DB || 'sub');
db.connect(mongoUrl);
new restIO(app, {
    db: db,
    resources: __dirname + '/resources'
});
app.listen(port, function () {
    console.log('Server has started under port: ' + port);
});
module.exports = app;
