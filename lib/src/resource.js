var express = require('express');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var Resource;
(function (Resource_1) {
    var app;
    var Resource = (function () {
        function Resource(resDef) {
            var _this = this;
            this.baseUrl = '/api';
            this.buildParentSearch = function (req) {
                var query = {};
                var resource = _this;
                while (!!resource.parentRef) {
                    query[resource.parentRef] = new ObjectId(req.params[resource.parentResource.paramId]);
                    resource = resource.parentResource;
                }
                return query;
            };
            if (!!resDef.parentResource) {
                this.parentResource = resDef.parentResource;
                this.baseUrl = resDef.parentResource.parameterizedUrl;
                this.parentRef = resDef.parentRef || resDef.parentResource.resDef.name;
            }
            this.app = app;
            this.populate = resDef.populate;
            this.model = this.createModel(resDef);
            this.resDef = resDef;
            this.setupRoutes();
        }
        Resource.prototype.createModel = function (resDef) {
            var schema = new mongoose.Schema(resDef.model);
            return mongoose.model(this.toClassName(resDef.name), schema);
        };
        Resource.prototype.toClassName = function (name) {
            return name.replace(/\w\S*/g, function (namePart) {
                return namePart.charAt(0).toUpperCase() + namePart.substr(1).toLowerCase();
            });
        };
        Resource.prototype.setupRoutes = function () {
            var _this = this;
            this.url = this.baseUrl + '/';
            this.url += this.resDef.plural || this.resDef.name + 's';
            this.paramId = this.resDef.name + 'Id';
            app.param(this.paramId, String);
            this.parameterizedUrl = this.url + '/:' + this.paramId;
            this.router = express.Router();
            this.router
                .route(this.url)
                .get(function (req, res) { return _this.getAll(req, res); })
                .post(function (req, res) { return _this.create(req, res); });
            this.router
                .route(this.parameterizedUrl)
                .get(function (req, res) { return _this.getById(req, res); })
                .put(function (req, res) { return _this.update(req, res); })
                .delete(function (req, res) { return _this.del(req, res); });
            app.use(this.router);
        };
        Resource.prototype.getAll = function (req, res) {
            var _this = this;
            var query = this.buildParentSearch(req);
            var getQuery = this.model.find(query);
            getQuery
                .populate(this.parentRef || '')
                .populate(this.populate || '')
                .exec()
                .then(function (result) { return res.send(result); }, function (err) { return _this.errorHandler(err, res); });
        };
        Resource.prototype.getById = function (req, res) {
            var _this = this;
            var id = req.params[this.paramId];
            this.model.findById(id)
                .populate(this.parentRef || '')
                .populate(this.populate || '')
                .exec()
                .then(function (model) { return res.send(model); }, function (err) { return _this.errorHandler(err, res); });
        };
        Resource.prototype.create = function (req, res) {
            var _this = this;
            this.model.create(req.body)
                .then(function (model) { return res.send(model); }, function (err) { return _this.errorHandler(err, res); });
        };
        Resource.prototype.update = function (req, res) {
            var _this = this;
            var id = req.params[this.paramId];
            this.model.findByIdAndUpdate(id, req.body)
                .exec()
                .then(function (model) { return res.send(model); }, function (err) { return _this.errorHandler(err, res); });
        };
        Resource.prototype.del = function (req, res) {
            var _this = this;
            var id = req.params[this.paramId];
            this.model.findByIdAndRemove(id, req.body)
                .exec()
                .then(function (model) { return res.send(model); }, function (err) { return _this.errorHandler(err, res); });
        };
        Resource.prototype.errorHandler = function (err, res) {
            console.log(err);
            res.status(500).send('internal server error');
        };
        return Resource;
    })();
    Resource_1.Resource = Resource;
    function registerApp(registerApp) {
        app = registerApp;
    }
    Resource_1.registerApp = registerApp;
})(Resource || (Resource = {}));
module.exports = Resource;
