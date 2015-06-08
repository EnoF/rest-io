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
            this.setupRoutes = function (resDef) {
                _this.url = _this.baseUrl + '/';
                _this.url += resDef.plural || resDef.name + 's';
                _this.resDef = resDef;
                _this.paramId = _this.resDef.name + 'Id';
                app.param(_this.paramId, String);
                _this.parameterizedUrl = _this.url + '/:' + _this.paramId;
                _this.router = express.Router();
                _this.router
                    .route(_this.url)
                    .get(_this.getAll)
                    .post(_this.create);
                _this.router
                    .route(_this.parameterizedUrl)
                    .get(_this.getById)
                    .put(_this.update)
                    .delete(_this.del);
                app.use(_this.router);
            };
            this.getAll = function (req, res) {
                var query = _this.buildParentSearch(req);
                var getQuery = _this.model.find(query);
                getQuery
                    .populate(_this.parentRef || '')
                    .populate(_this.populate || '')
                    .exec()
                    .then(function (result) { return res.send(result); }, function (err) { return _this.errorHandler(err, res); });
            };
            this.buildParentSearch = function (req) {
                var query = {};
                var resource = _this;
                while (!!resource.parentRef) {
                    query[resource.parentRef] = new ObjectId(req.params[resource.parentResource.paramId]);
                    resource = resource.parentResource;
                }
                return query;
            };
            this.getById = function (req, res) {
                var id = req.params[_this.paramId];
                _this.model.findById(id)
                    .populate(_this.parentRef || '')
                    .populate(_this.populate || '')
                    .exec()
                    .then(function (model) { return res.send(model); }, function (err) { return _this.errorHandler(err, res); });
            };
            this.create = function (req, res) {
                _this.model.create(req.body)
                    .then(function (model) { return res.send(model); }, function (err) { return _this.errorHandler(err, res); });
            };
            this.update = function (req, res) {
                var id = req.params[_this.paramId];
                _this.model.findByIdAndUpdate(id, req.body)
                    .exec()
                    .then(function (model) { return res.send(model); }, function (err) { return _this.errorHandler(err, res); });
            };
            this.del = function (req, res) {
                var id = req.params[_this.paramId];
                _this.model.findByIdAndRemove(id, req.body)
                    .exec()
                    .then(function (model) { return res.send(model); }, function (err) { return _this.errorHandler(err, res); });
            };
            this.errorHandler = function (err, res) {
                console.log(err);
                res.status(500).send('internal server error');
            };
            if (!!resDef.parentResource) {
                this.parentResource = resDef.parentResource;
                this.baseUrl = resDef.parentResource.parameterizedUrl;
                this.parentRef = resDef.parentRef || resDef.parentResource.resDef.name;
            }
            this.populate = resDef.populate;
            this.model = this.createModel(resDef);
            this.setupRoutes(resDef);
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
        return Resource;
    })();
    Resource_1.Resource = Resource;
    function registerApp(registerApp) {
        app = registerApp;
    }
    Resource_1.registerApp = registerApp;
})(Resource || (Resource = {}));
module.exports = Resource;
