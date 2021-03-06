"use strict";
var express = require('express');
var index_1 = require('../../src/index');
var mongoose = require('mongoose');
exports.app = express();
var port = 4000;
var db = new mongoose.Mongoose();
var host = process.env.MONGO_PORT_27017_TCP_ADDR || 'localhost';
var mongoUrl = "mongodb://" + host + ":" + (process.env.MONGO_PORT || '27017') + "/";
mongoUrl += (process.env.DB || 'auth');
db.connect(mongoUrl);
new index_1.default(exports.app, {
    db: db,
    resources: __dirname + "/resources"
});
process.env.REST_IO_HMAC_KEY = process.env.REST_IO_HMAC_KEY || 'hmac key which set via js to demo';
process.env.REST_IO_AES_KEY = process.env.REST_IO_AES_KEY || 'aes key which is set via js to demo';
exports.app.listen(port, function () {
    console.log("Server has started under port: " + port);
});
