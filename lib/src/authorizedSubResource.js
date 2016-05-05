"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var authorizedResource_1 = require('./authorizedResource');
var subResource_1 = require('./subResource');
var AuthorizedSubResource = (function (_super) {
    __extends(AuthorizedSubResource, _super);
    function AuthorizedSubResource(subResDef) {
        var resDef = {
            name: null,
            model: null
        };
        for (var prop in subResDef) {
            if (subResDef.hasOwnProperty(prop)) {
                resDef[prop] = subResDef[prop];
            }
        }
        _super.call(this, resDef);
    }
    AuthorizedSubResource.prototype.createModel = function (resDef) {
        return resDef.parentResource.model;
    };
    AuthorizedSubResource.prototype.getAll = function (req, res) {
        var _this = this;
        this.isAuthorized(req, this.permissions.getAll)
            .then(function () { return subResource_1.default.prototype.getAll.call(_this, req, res); }, function (err) { return _this.sendUnauthorized(err, res); });
    };
    AuthorizedSubResource.prototype.getById = function (req, res) {
        var _this = this;
        this.isAuthorized(req, this.permissions.getById)
            .then(function () { return subResource_1.default.prototype.getById.call(_this, req, res); }, function (err) { return _this.sendUnauthorized(err, res); });
    };
    AuthorizedSubResource.prototype.create = function (req, res) {
        var _this = this;
        this.isAuthorized(req, this.permissions.create)
            .then(function () { return subResource_1.default.prototype.create.call(_this, req, res); }, function (err) { return _this.sendUnauthorized(err, res); });
    };
    AuthorizedSubResource.prototype.update = function (req, res) {
        var _this = this;
        this.isAuthorized(req, this.permissions.update)
            .then(function () { return subResource_1.default.prototype.update.call(_this, req, res); }, function (err) { return _this.sendUnauthorized(err, res); });
    };
    AuthorizedSubResource.prototype.del = function (req, res) {
        var _this = this;
        this.isAuthorized(req, this.permissions.del)
            .then(function () { return subResource_1.default.prototype.del.call(_this, req, res); }, function (err) { return _this.sendUnauthorized(err, res); });
    };
    AuthorizedSubResource.prototype.createProjectionQuery = function (req) {
        return subResource_1.default.prototype.createProjectionQuery.call(this, req);
    };
    AuthorizedSubResource.prototype.createPullQuery = function (req) {
        return subResource_1.default.prototype.createPullQuery.call(this, req);
    };
    AuthorizedSubResource.prototype.createFindQuery = function (req) {
        return subResource_1.default.prototype.createFindQuery.call(this, req);
    };
    AuthorizedSubResource.prototype.createSubUpdateQuery = function (req) {
        return subResource_1.default.prototype.createSubUpdateQuery.call(this, req);
    };
    return AuthorizedSubResource;
}(authorizedResource_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AuthorizedSubResource;
