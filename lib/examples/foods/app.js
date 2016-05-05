"use strict";
var express = require('express');
var index_1 = require('../../src/index');
var mongoose = require('mongoose');
exports.app = express();
var port = 3000;
new index_1.default(exports.app, {
    resources: __dirname + "/resources"
});
var host = process.env.MONGO_PORT_27017_TCP_ADDR || 'localhost';
var mongoUrl = "mongodb://" + host + ":" + (process.env.MONGO_PORT || '27017') + "/";
mongoUrl += (process.env.DB || 'foods');
mongoose.connect(mongoUrl);
exports.app.listen(port, function () {
    console.log("Server has started under port: " + port);
});
