var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var authorizedResource_1 = require('./authorizedResource');
var SubResource = require('./subResource');
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
            .then(function () { return SubResource.prototype.getAll.call(_this, req, res); }, function (err) { return _this.sendUnauthorized(err, res); });
    };
    AuthorizedSubResource.prototype.getById = function (req, res) {
        var _this = this;
        this.isAuthorized(req, this.permissions.getById)
            .then(function () { return SubResource.prototype.getById.call(_this, req, res); }, function (err) { return _this.sendUnauthorized(err, res); });
    };
    AuthorizedSubResource.prototype.create = function (req, res) {
        var _this = this;
        this.isAuthorized(req, this.permissions.create)
            .then(function () { return SubResource.prototype.create.call(_this, req, res); }, function (err) { return _this.sendUnauthorized(err, res); });
    };
    AuthorizedSubResource.prototype.createProjectionQuery = function (req) {
        return SubResource.prototype.createProjectionQuery.call(this, req);
    };
    AuthorizedSubResource.prototype.createPullQuery = function (req) {
        return SubResource.prototype.createPullQuery.call(this, req);
    };
    AuthorizedSubResource.prototype.createFindQuery = function (req) {
        return SubResource.prototype.createFindQuery.call(this, req);
    };
    AuthorizedSubResource.prototype.createSubUpdateQuery = function (req) {
        return SubResource.prototype.createSubUpdateQuery.call(this, req);
    };
    return AuthorizedSubResource;
})(authorizedResource_1.AuthorizedResource);
module.exports = AuthorizedSubResource;
