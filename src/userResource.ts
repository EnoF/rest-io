import authorizedResource = require('./authorizedResource');
import AuthorizedResource = authorizedResource.AuthorizedResource;
import IMethodAccess = authorizedResource.IMethodAccess;
import ROLES = authorizedResource.ROLES;
import resource = require('./resource');
import Resource = resource.Resource;
import IResource = resource.IResource;

import express = require('express');
import Request = express.Request;
import Router = express.Router;
import Application = express.Application;
import Response = express.Response;
import auth = require('./authentication');

import mongoose = require('mongoose');
import Model = mongoose.Model;
import Schema = mongoose.Schema;

class UserResource extends AuthorizedResource {

  roles: IMethodAccess = {
    getAll: [ROLES.USER, ROLES.MODERATOR, ROLES.ADMIN],
    getById: [ROLES.USER, ROLES.MODERATOR, ROLES.ADMIN],
    create: [],
    update: [ROLES.USER, ROLES.MODERATOR, ROLES.ADMIN],
    del: [ROLES.USER, ROLES.MODERATOR, ROLES.ADMIN]
  }

  createModel(resDef: IResource) {
    this.ensureBaseUserModel(resDef.model);
    resDef.model.roles = [{
      type: Schema.Types.ObjectId,
      ref: 'Role'
    }];
    this.createRoleModel();
    return super.createModel(resDef);
  }

  ensureBaseUserModel(model: any) {
    model.userName = String;
    model.password = String;
  }

  createRoleModel() {
    var roleSchema = new Schema({
      name: String
    });
    this.db.model('Role', roleSchema);
  }

  setupRoutes() {
    super.setupRoutes();
    this.router
      .route(this.url + '/login')
      .post((req, res) => this.login(req, res));
  }

  sendUnauthorized(res) {
    res.status(401).send('unauthorized');
  }

  create(req: Request, res: Response) {
    req.body.password = auth.encryptPassword(req.body.password);
    super.create(req, res);
  }

  login(req: Request, res: Response) {
    var password = auth.encryptPassword(req.body.password);
    this.model.findOne({
      userName: new RegExp('^' + req.body.userName + '$', 'i'),
      password: password
    }).exec()
      .then((user: any) => {
        if (!!user) {
          res.send({
            user: user,
            authToken: auth.createAuthToken(user._id.toString())
          });
        } else {
          this.sendUnauthorized(res);
        }
      }, () => this.sendUnauthorized(res));
  }
}

export = UserResource;
