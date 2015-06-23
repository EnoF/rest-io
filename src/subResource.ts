import {Resource, IResource} from './resource';
import {Request, Response} from 'express';
import {Document} from 'mongoose';

class SubResource extends Resource {
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
    this.model.findById(req.params[this.parentResource.paramId])
      .populate(this.resDef.populate || '')
      .exec()
      .then((model: Document) => res.send(model[this.resDef.plural]),
        (err: Error) => this.errorHandler(err, res));
  }

  getById(req: Request, res: Response) {
    this.model.findById(req.params[this.parentResource.paramId],
      this.createProjectionQuery(req))
      .populate(this.resDef.populate || '')
      .exec()
      .then((model: Document) => res.send(model[this.resDef.plural][0]),
        (err) => this.errorHandler(err, res));
  }

  createProjectionQuery(req: Request) {
    var projection = {};
    projection[this.resDef.plural] = {
      $elemMatch: {
        _id: req.params[this.paramId]
      }
    }
    return projection;
  }

  create(req: Request, res: Response) {
    var pushQuery = {};
    pushQuery[this.resDef.plural] = req.body;
    this.model.findByIdAndUpdate(req.params[this.parentResource.paramId], {
      $push: pushQuery
    }).exec()
      .then((model: Document) => res.send(model),
        (err: Error) => this.errorHandler(err, res))
  }

  del(req: Request, res: Response) {
    this.model.findByIdAndUpdate(req.params[this.parentResource.paramId], {
      $pull: this.createPullQuery(req)
    }).exec()
      .then((model: Document) => res.send(model),
        (err: Error) => this.errorHandler(err, res));
  }

  createPullQuery(req: Request) {
    var pullQuery = {};
    pullQuery[this.resDef.plural] = {
      _id: req.params[this.paramId]
    };
    return pullQuery;
  }

  update(req: Request, res: Response) {
    this.model.findOneAndUpdate(this.createFindQuery(req), {
      $set: this.createSubUpdateQuery(req)
    }).exec()
      .then((model: Document) => res.send(model),
        (err: Error) => this.errorHandler(err, res));
  }

  createFindQuery(req: Request) {
    var findQuery = {
      _id: req.params[this.parentResource.paramId]
    };
    findQuery[`${this.resDef.plural}._id`] = req.params[this.paramId];
    return findQuery;
  }

  createSubUpdateQuery(req: Request) {
    var setQuery = {};
    for (var prop in req.body) {
      if (req.body.hasOwnProperty(prop)) {
        setQuery[`${this.resDef.plural}.$.${prop}`] = req.body[prop];
      }
    }
    return setQuery;
  }
}

interface ISubResource {
  name: string;
  plural?: string;
  parentResource: Resource;
  populate?: string;
}

export = SubResource;
