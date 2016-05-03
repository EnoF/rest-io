"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var resource = require('../../../src/resource');
var Resource = resource.Resource;
var BoomerangResource = (function (_super) {
    __extends(BoomerangResource, _super);
    function BoomerangResource() {
        _super.apply(this, arguments);
    }
    BoomerangResource.prototype.setupRoutes = function () {
        var _this = this;
        _super.prototype.setupRoutes.call(this);
        this.router
            .route(this.url + '/add')
            .post(function (req, res) { return _this.addAndRetrieve(req, res); });
    };
    BoomerangResource.prototype.getAll = function (req, res) {
        res.status(600).send(req.query.name);
    };
    BoomerangResource.prototype.getById = function (req, res) {
        res.status(600).send(req.params.boomerangId + ' ' + this.resDef.name);
    };
    BoomerangResource.prototype.create = function (req, res) {
        res.status(600).send(req.body.message);
    };
    BoomerangResource.prototype.addAndRetrieve = function (req, res) {
        this.model.create(req.body)
            .then(function (boomerang) {
            res.status(707).send(boomerang);
        });
    };
    return BoomerangResource;
}(Resource));
module.exports = BoomerangResource;
