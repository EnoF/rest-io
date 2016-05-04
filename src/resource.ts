import * as express from 'express';
import { Request, Router, Application, Response } from 'express';

import * as mongoose from 'mongoose';
import { Mongoose, Schema, Model, Document, Types } from 'mongoose';
const { ObjectId } = Types;

import * as pluralize from 'pluralize';

// The app reference it used to register params.
let app;
let db: Mongoose;

export class Resource {
  static BASE_URL = '/api';

  baseUrl: string = Resource.BASE_URL;
  url: string;
  parameterizedUrl: string;
  model: Model<Document>;
  resDef: IResource;
  parentResource: Resource;
  router: Router;
  app: Application;
  db: Mongoose;
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
    this.db = db;
    this.populate = resDef.populate;
    this.model = this.createModel(resDef);
    this.resDef = resDef;
    this.setupRoutes();
  }

  createModel(resDef: IResource) {
    const schema = new Schema(resDef.model);
    return this.db.model(this.toClassName(resDef.name), schema);
  }

  toClassName(name: string) {
    return name.replace(/\w\S*/g, (namePart) => {
      return namePart.charAt(0).toUpperCase() + namePart.substr(1).toLowerCase();
    });
  }

  setupRoutes() {
    this.url = `${this.baseUrl}/`;
    this.resDef.plural = this.resDef.plural || pluralize.plural(this.resDef.name);
    this.url += this.resDef.plural;

    this.paramId = `${this.resDef.name}Id`;
    app.param(this.paramId, String);
    this.parameterizedUrl = `${this.url}/:${this.paramId}`;

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
    this.setupRecursiveRoutes();
    app.use(this.router);
  }

  setupRecursiveRoutes() {
    let resource: Resource = this.parentResource;
    if (!!resource) {
      // Ensure the getter on root level
      this.router.route(`${Resource.BASE_URL}/${this.resDef.plural}`)
        .get((req, res) => this.getAll(req, res));
      // Setup recursively on all parent resources a getter
      while (!!resource && !!resource.parentRef) {
        resource = resource.parentResource;
        this.router.route(`${resource.url}/${this.resDef.plural}`)
          .get((req, res) => this.getAll(req, res));
      }
    }
  }

  getAll(req: Request, res: Response) {
    try {
      const query: Object = this.buildSearchQuery(req);
      const getQuery = this.model.find(query);
      getQuery
        .populate(this.buildPopulateQuery(req))
        .exec()
        .then((result: Array<Document>) => res.send(result),
          (err: Error) => this.errorHandler(err, res));
    } catch (err) {
      this.errorHandler(err, res)
    }
  }

  buildPopulateQuery(req: Request) {
    if (typeof req.query.populate === 'string') {
      return req.query.populate;
    } else {
      return `${this.parentRef} ${this.populate}`;
    }
  }

  buildSearchQuery(req: Request) {
    const query = {};
    for (let attr in req.query) {
      // ignore populate attribute
      if (req.query.hasOwnProperty(attr) && attr !== 'populate') {
        query[attr] = this.createQuery(req.query[attr]);
      }
    }
    this.buildParentSearch(req, query);
    return query;
  }

  createQuery(query: string) {
    try {
      return JSON.parse(query);
    } catch (error) {
      return this.createRegex(query);
    }
  }

  createRegex(query: string) {
    if (!query.match(/\//)) {
      query = `/${query}/`;
    }
    const splitQuery = query.split('/');
    const modifier = splitQuery.pop();
    splitQuery.shift();
    return new RegExp(splitQuery.join('/'), modifier);
  }

  buildParentSearch(req: Request, query) {
    let resource: Resource = this;
    while (!!resource.parentRef) {
      const id = req.params[resource.parentResource.paramId];
      if (!!id) {
        query[resource.parentRef] = new ObjectId(id);
      } else {
        break;
      }
      resource = resource.parentResource;
    }
    return query;
  }

  getById(req: Request, res: Response) {
    const id = req.params[this.paramId];
    this.model.findById(id)
      .populate(this.buildPopulateQuery(req))
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
    const id = req.params[this.paramId];
    this.model.findByIdAndUpdate(id, req.body)
      .exec()
      .then((model: Document) => res.send(model),
        (err: Error) => this.errorHandler(err, res));
  }

  del(req: Request, res: Response) {
    const id = req.params[this.paramId];
    this.model.findByIdAndRemove(id, req.body)
      .exec()
      .then((model: Document) => res.send(model),
        (err: Error) => this.errorHandler(err, res));
  }

  errorHandler(err: Error, res: Response) {
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
