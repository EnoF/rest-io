import express = require('express');
import Request = express.Request;
import Router = express.Router;
import Application = express.Application;
import Response = express.Response;

import mongoose = require('mongoose');
import Mongoose = mongoose.Mongoose;
import Schema = mongoose.Schema;
import Model = mongoose.Model;
import Document = mongoose.Document;
import ObjectId = mongoose.Types.ObjectId;

module Resource {
  // The app reference it used to register params.
  var app;
  var db: Mongoose;

  export class Resource {
    baseUrl: string = '/api';
    url: string;
    parameterizedUrl: string;
    model: Model<Document>;
    resDef: IResource;
    parentResource: Resource;
    router: Router;
    app: Application;
    paramId: string;
    parentRef: string;
    populate: string;

    constructor(resDef: IResource) {
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

    createModel(resDef: IResource) {
      var schema = new Schema(resDef.model);
      return db.model(this.toClassName(resDef.name), schema);
    }

    toClassName(name: string) {
      return name.replace(/\w\S*/g, (namePart) => {
        return namePart.charAt(0).toUpperCase() + namePart.substr(1).toLowerCase();
      });
    }

    setupRoutes() {
      this.url = this.baseUrl + '/';
      this.url += this.resDef.plural || this.resDef.name + 's';

      this.paramId = this.resDef.name + 'Id';
      app.param(this.paramId, String);
      this.parameterizedUrl = this.url + '/:' + this.paramId;

      this.router = express.Router();
      this.router
        .route(this.url)
        .get((req, res) => this.getAll(req, res))
        .post((req, res) => this.create(req, res));
      this.router
        .route(this.parameterizedUrl)
        .get((req, res) => this.getById(req, res))
        .put((req, res) => this.update(req, res))
        .delete((req, res) => this.del(req, res));
      app.use(this.router);
    }

    getAll(req: Request, res: Response) {
      try {
        var query: Object = this.buildParentSearch(req);
        var getQuery = this.model.find(query);
        getQuery
          .populate(this.parentRef || '')
          .populate(this.populate || '')
          .exec()
          .then((result: Array<Document>) => res.send(result),
            (err: Error) => this.errorHandler(err, res));
      } catch (err) {
        console.log(err);
      }
    }

    buildParentSearch = (req: Request) => {
      var query = {};
      var resource: Resource = this;
      while (!!resource.parentRef) {
        query[resource.parentRef] = new ObjectId(req.params[resource.parentResource.paramId]);
        resource = resource.parentResource;
      }
      return query;
    }

    getById(req: Request, res: Response) {
      var id = req.params[this.paramId];
      this.model.findById(id)
        .populate(this.parentRef || '')
        .populate(this.populate || '')
        .exec()
        .then((model: Document) => res.send(model),
          (err: Error) => this.errorHandler(err, res));
    }

    create(req: Request, res: Response) {
      this.model.create(req.body)
        .then((model: Document) => res.send(model),
          (err: Error) => this.errorHandler(err, res));
    }

    update(req: Request, res: Response) {
      var id = req.params[this.paramId];
      this.model.findByIdAndUpdate(id, req.body)
        .exec()
        .then((model: Document) => res.send(model),
          (err: Error) => this.errorHandler(err, res));
    }

    del(req: Request, res: Response) {
      var id = req.params[this.paramId];
      this.model.findByIdAndRemove(id, req.body)
        .exec()
        .then((model: Document) => res.send(model),
          (err: Error) => this.errorHandler(err, res));
    }

    errorHandler(err: Error, res: express.Response) {
      console.log(err);
      res.status(500).send('internal server error');
    }
  }

  export interface IResource {
    name: string;
    model: any;
    parentRef?: string;
    populate?: string;
    plural?: string;
    parentResource?: Resource;
  }

  export function registerApp(registerApp, connection: Mongoose) {
    app = registerApp;
    db = connection || mongoose;
  }
}

export = Resource;
