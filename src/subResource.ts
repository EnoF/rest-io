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
      .exec()
      .then((model: Document) => res.send(model[this.resDef.plural]),
        (err: Error) => this.errorHandler(err, res));
  }

  getById(req: Request, res: Response) {
    var projection = {};
    projection[this.resDef.plural] = {
      $elemMatch: {
        _id: req.params[this.paramId]
      }
    }
    this.model.findById(req.params[this.parentResource.paramId], projection)
      .exec()
      .then((model: Document) => res.send(model[this.resDef.plural][0]),
        (err) => this.errorHandler(err, res));
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
}

interface ISubResource {
  name: string;
  plural?: string;
  parentResource: Resource;
  populate?: string;
}

export = SubResource;
