import {AuthorizedResource} from './authorizedResource';
import {Resource, IResource} from './resource';
import {Request, Response} from 'express';
import SubResource = require('./subResource');

class AuthorizedSubResource extends AuthorizedResource {
  constructor(subResDef: ISubResource) {
    var resDef = {
      name: null,
      model: null
    };
    for (var prop in subResDef) {
      if (subResDef.hasOwnProperty(prop)) {
        resDef[prop] = subResDef[prop];
      }
    }
    super(resDef);
  }

  createModel(resDef: IResource) {
    // sub resource model is already created
    return resDef.parentResource.model;
  }

  getAll(req: Request, res: Response) {
    this.isAuthorized(req, this.permissions.getAll)
      .then(() => SubResource.prototype.getAll.call(this, req, res),
        (err: Error) => this.sendUnauthorized(err, res));
  }

  getById(req: Request, res: Response) {
    this.isAuthorized(req, this.permissions.getById)
      .then(() => SubResource.prototype.getById.call(this, req, res),
        (err: Error) => this.sendUnauthorized(err, res));
  }

  create(req: Request, res: Response) {
    this.isAuthorized(req, this.permissions.create)
      .then(() => SubResource.prototype.create.call(this, req, res),
        (err: Error) => this.sendUnauthorized(err, res));
  }

  createProjectionQuery(req: Request) {
    return SubResource.prototype.createProjectionQuery.call(this, req);
  }

  createPullQuery(req: Request) {
    return SubResource.prototype.createPullQuery.call(this, req);
  }

  createFindQuery(req: Request) {
    return SubResource.prototype.createFindQuery.call(this, req);
  }

  createSubUpdateQuery(req: Request) {
    return SubResource.prototype.createSubUpdateQuery.call(this, req);
  }
}

interface ISubResource {
  name: string;
  plural?: string;
  parentResource: Resource;
  populate?: string;
}

export = AuthorizedSubResource;
