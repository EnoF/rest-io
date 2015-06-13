var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var resource = require('./resource');
var Resource = resource.Resource;
var auth = require('./authentication');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = (function (_super) {
    __extends(User, _super);
    function User() {
        _super.apply(this, arguments);
    }
    User.prototype.createModel = function (resDef) {
        this.ensureBaseUserModel(resDef.model);
        resDef.model.roles = [{
                type: Schema.Types.ObjectId,
                ref: 'Role'
            }];
        this.createRoleModel();
        return _super.prototype.createModel.call(this, resDef);
    };
    User.prototype.ensureBaseUserModel = function (model) {
        model.userName = String;
        model.password = String;
    };
    User.prototype.createRoleModel = function () {
        var roleSchema = new Schema({
            name: String
        });
        mongoose.model('Role', roleSchema);
    };
    User.prototype.setupRoutes = function () {
        var _this = this;
        _super.prototype.setupRoutes.call(this);
        this.router
            .route(this.url + '/login')
            .post(function (req, res) { return _this.login(req, res); });
    };
    User.prototype.sendUnauthorized = function (res) {
        res.status(401).send('unauthorized');
    };
    User.prototype.create = function (req, res) {
        req.body.password = auth.encryptPassword(req.body.password);
        _super.prototype.create.call(this, req, res);
    };
    User.prototype.login = function (req, res) {
        var _this = this;
        var password = auth.encryptPassword(req.body.password);
        this.model.findOne({
            userName: new RegExp('^' + req.body.userName + '$', 'i'),
            password: password
        }).exec()
            .then(function (user) {
            if (!!user) {
                res.send({
                    user: user,
                    authToken: auth.createAuthToken(user._id.toString())
                });
            }
            else {
                _this.sendUnauthorized(res);
            }
        }, function () { return _this.sendUnauthorized(res); });
    };
    return User;
})(Resource);
module.exports = User;
