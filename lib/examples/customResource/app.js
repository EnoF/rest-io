"use strict";
var express = require('express');
var index_1 = require('../../src/index');
var mongoose = require('mongoose');
exports.app = express();
var port = 3030;
var host = process.env.MONGO_PORT_27017_TCP_ADDR || 'localhost';
var mongoUrl = "mongodb://" + host + ":" + (process.env.MONGO_PORT || '27017') + "/";
var db = new mongoose.Mongoose();
mongoUrl += (process.env.DB || 'customResource');
db.connect(mongoUrl);
new index_1.default(exports.app, {
    db: db,
    resources: __dirname + "/resources"
});
exports.app.listen(port, function () {
    console.log("Server has started under port: " + port);
});
