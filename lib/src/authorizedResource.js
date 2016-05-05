"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var resource_1 = require('./resource');
var auth = require('./authentication');
var mongoose = require('mongoose');
exports.ROLES = {
    USER: 'USER',
    SUPER_USER: 'SUPER_USER',
    MODERATOR: 'MODERATOR',
    ADMIN: 'ADMIN'
};
var AuthorizedResource = (function (_super) {
    __extends(AuthorizedResource, _super);
    function AuthorizedResource() {
        _super.apply(this, arguments);
        this.maxDays = 7;
        this.permissions = {
            getAll: [exports.ROLES.USER, exports.ROLES.SUPER_USER, exports.ROLES.MODERATOR, exports.ROLES.ADMIN],
            getById: [exports.ROLES.USER, exports.ROLES.SUPER_USER, exports.ROLES.MODERATOR, exports.ROLES.ADMIN],
            create: [exports.ROLES.USER, exports.ROLES.SUPER_USER, exports.ROLES.MODERATOR, exports.ROLES.ADMIN],
            update: [exports.ROLES.USER, exports.ROLES.SUPER_USER, exports.ROLES.MODERATOR, exports.ROLES.ADMIN],
            del: [exports.ROLES.USER, exports.ROLES.SUPER_USER, exports.ROLES.MODERATOR, exports.ROLES.ADMIN]
        };
        this.baseGetAll = _super.prototype.getAll;
        this.baseGetById = _super.prototype.getById;
        this.baseCreate = _super.prototype.create;
        this.baseUpdate = _super.prototype.update;
        this.baseDel = _super.prototype.del;
    }
    AuthorizedResource.prototype.isTokenExpired = function (createdAt) {
        var maxTokenLifeTime = new Date();
        maxTokenLifeTime.setDate(maxTokenLifeTime.getDate() - this.maxDays);
        return createdAt < maxTokenLifeTime;
    };
    AuthorizedResource.prototype.getRoles = function (id) {
        return this.db.model('User')
            .findById(id)
            .populate('roles')
            .exec();
    };
    AuthorizedResource.prototype.hasAuthorizedRole = function (roles, authorizedRoles) {
        var hasRole = false;
        roles.forEach(function (_a) {
            var name = _a.name;
            authorizedRoles.forEach(function (authRole) {
                if (name === authRole) {
                    hasRole = true;
                }
            });
        });
        return hasRole;
    };
    AuthorizedResource.prototype.hasAccessRightsDefined = function (req, authorizedRoles) {
        var promise = new mongoose.Promise();
        var authToken = req.header('Authorization');
        if (authorizedRoles.length === 0) {
            promise.resolve(null, null);
            return promise;
        }
    };
    AuthorizedResource.prototype.isAuthorized = function (req, authorizedRoles) {
        var _this = this;
        var promise = new mongoose.Promise();
        var authToken = req.header('Authorization');
        if (authorizedRoles.length === 0) {
            promise.resolve(null, null);
            return promise;
        }
        else if (!authToken) {
            promise.resolve(new Error('no token found'), null);
            return promise;
        }
        var _a = auth.decryptAuthToken(authToken), id = _a.id, createdAt = _a.createdAt;
        return this.getRoles(id)
            .then(function (_a) {
            var roles = _a.roles;
            if (_this.isTokenExpired(createdAt)) {
                throw new Error('token expired');
            }
            return roles;
        })
            .then(function (roles) {
            if (!_this.hasAuthorizedRole(roles, authorizedRoles)) {
                throw new Error('unauthorized');
            }
        });
    };
    AuthorizedResource.prototype.sendUnauthorized = function (error, res) {
        res.status(401).send('unauthorized');
    };
    AuthorizedResource.prototype.getAll = function (req, res) {
        var _this = this;
        this.isAuthorized(req, this.permissions.getAll)
            .then(function () { return _super.prototype.getAll.call(_this, req, res); }, function (err) { return _this.sendUnauthorized(err, res); });
    };
    AuthorizedResource.prototype.getById = function (req, res) {
        var _this = this;
        this.isAuthorized(req, this.permissions.getById)
            .then(function () { return _super.prototype.getById.call(_this, req, res); }, function (err) { return _this.sendUnauthorized(err, res); });
    };
    AuthorizedResource.prototype.create = function (req, res) {
        var _this = this;
        this.isAuthorized(req, this.permissions.create)
            .then(function () { return _super.prototype.create.call(_this, req, res); }, function (err) { return _this.sendUnauthorized(err, res); });
    };
    AuthorizedResource.prototype.update = function (req, res) {
        var _this = this;
        this.isAuthorized(req, this.permissions.update)
            .then(function () { return _super.prototype.update.call(_this, req, res); }, function (err) { return _this.sendUnauthorized(err, res); });
    };
    AuthorizedResource.prototype.del = function (req, res) {
        var _this = this;
        this.isAuthorized(req, this.permissions.del)
            .then(function () { return _super.prototype.del.call(_this, req, res); }, function (err) { return _this.sendUnauthorized(err, res); });
    };
    return AuthorizedResource;
}(resource_1.Resource));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AuthorizedResource;
