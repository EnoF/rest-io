var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var resource_1 = require('./resource');
var SubResource = (function (_super) {
    __extends(SubResource, _super);
    function SubResource(subResDef) {
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
    SubResource.prototype.createModel = function (resDef) {
        return resDef.parentResource.model;
    };
    SubResource.prototype.getAll = function (req, res) {
        var _this = this;
        this.model.findById(req.params[this.parentResource.paramId])
            .exec()
            .then(function (model) { return res.send(model[_this.resDef.plural]); }, function (err) { return _this.errorHandler(err, res); });
    };
    SubResource.prototype.getById = function (req, res) {
        var _this = this;
        this.model.findById(req.params[this.parentResource.paramId], this.createProjectionQuery(req))
            .exec()
            .then(function (model) { return res.send(model[_this.resDef.plural][0]); }, function (err) { return _this.errorHandler(err, res); });
    };
    SubResource.prototype.createProjectionQuery = function (req) {
        var projection = {};
        projection[this.resDef.plural] = {
            $elemMatch: {
                _id: req.params[this.paramId]
            }
        };
        return projection;
    };
    SubResource.prototype.create = function (req, res) {
        var _this = this;
        var pushQuery = {};
        pushQuery[this.resDef.plural] = req.body;
        this.model.findByIdAndUpdate(req.params[this.parentResource.paramId], {
            $push: pushQuery
        }).exec()
            .then(function (model) { return res.send(model); }, function (err) { return _this.errorHandler(err, res); });
    };
    SubResource.prototype.del = function (req, res) {
        var _this = this;
        this.model.findByIdAndUpdate(req.params[this.parentResource.paramId], {
            $pull: this.createPullQuery(req)
        }).exec()
            .then(function (model) { return res.send(model); }, function (err) { return _this.errorHandler(err, res); });
    };
    SubResource.prototype.createPullQuery = function (req) {
        var pullQuery = {};
        pullQuery[this.resDef.plural] = {
            _id: req.params[this.paramId]
        };
        return pullQuery;
    };
    SubResource.prototype.update = function (req, res) {
        var _this = this;
        this.model.findOneAndUpdate(this.createFindQuery(req), {
            $set: this.createSubUpdateQuery(req.body)
        }).exec()
            .then(function (model) { return res.send(model); }, function (err) { return _this.errorHandler(err, res); });
    };
    SubResource.prototype.createFindQuery = function (req) {
        var findQuery = {
            _id: req.params[this.parentResource.paramId]
        };
        findQuery[(this.resDef.plural + "._id")] = req.params[this.paramId];
        return findQuery;
    };
    SubResource.prototype.createSubUpdateQuery = function (newSub) {
        var setQuery = {};
        for (var prop in newSub) {
            if (newSub.hasOwnProperty(prop)) {
                setQuery[(this.resDef.plural + ".$." + prop)] = newSub[prop];
            }
        }
        return setQuery;
    };
    return SubResource;
})(resource_1.Resource);
module.exports = SubResource;
