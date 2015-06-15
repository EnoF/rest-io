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

module authorizedResource {

  export var ROLES = {
    USER: 'USER',
    SUPER_USER: 'SUPER_USER',
    MODERATOR: 'MODERATOR',
    ADMIN: 'ADMIN'
  };

  export class AuthorizedResource extends Resource {
    methodAccess: IMethodAccess;
    maxDays: number = 7;

    roles: IMethodAccess = {
      getAll: [ROLES.USER, ROLES.SUPER_USER, ROLES.MODERATOR, ROLES.ADMIN],
      getById: [ROLES.USER, ROLES.SUPER_USER, ROLES.MODERATOR, ROLES.ADMIN],
      create: [ROLES.USER, ROLES.SUPER_USER, ROLES.MODERATOR, ROLES.ADMIN],
      update: [ROLES.USER, ROLES.SUPER_USER, ROLES.MODERATOR, ROLES.ADMIN],
      del: [ROLES.USER, ROLES.SUPER_USER, ROLES.MODERATOR, ROLES.ADMIN]
    };

    isTokenExpired(createdAt: Date) {
      var maxTokenLifeTime = new Date();
      maxTokenLifeTime.setDate(maxTokenLifeTime.getDate() - this.maxDays);
      return createdAt < maxTokenLifeTime;
    }

    getRoles(id: string) {
      return this.db.model('User')
        .findById(id)
        .populate('roles')
        .exec();
    }

    hasAuthorizedRole(roles: Array<any>, authorizedRoles: Array<string>) {
      var hasRole = false;
      roles.forEach((role) => {
        authorizedRoles.forEach((authRole: string) => {
          if (role.name === authRole) {
            hasRole = true;
          }
        });
      });
      return hasRole;
    }

    hasAccessRightsDefined(req: Request, authorizedRoles: Array<string>) {
      var promise = new mongoose.Promise();
      var authToken = req.header('Authorization');
      if (authorizedRoles.length === 0) {
        promise.resolve(null, null);
        return promise;
      }
    }

    isAuthorized(req: Request, authorizedRoles: Array<string>) {
      var promise = new mongoose.Promise();
      var authToken = req.header('Authorization');
      if (authorizedRoles.length === 0) {
        promise.resolve(null, null);
        return promise;
      } else if (!authToken) {
        promise.resolve(new Error('no token found'), null);
        return promise;
      }
      var tokenDetails = auth.decryptAuthToken(authToken);
      return this.getRoles(tokenDetails.id)
        .then((user: any) => {
          if (this.isTokenExpired(tokenDetails.createdAt)) {
            throw new Error('token expired');
          }
          return user.roles;
        })
        .then((roles: Array<any>) => {
          if (!this.hasAuthorizedRole(roles, authorizedRoles)) {
            throw new Error('unauthorized');
          }
        });
    }

    sendUnauthorized(error: Error, res: Response) {
      res.status(401).send('unauthorized');
    }

    baseGetAll = super.getAll;
    baseGetById = super.getById;
    baseCreate = super.create;
    baseUpdate = super.update;
    baseDel = super.del;

    getAll(req: Request, res: Response) {
      this.isAuthorized(req, this.roles.getAll)
        .then(() => super.getAll(req, res),
          (err) => this.sendUnauthorized(err, res));
    }

    getById(req: Request, res: Response) {
      this.isAuthorized(req, this.roles.getById)
        .then(() => super.getById(req, res),
          (err) => this.sendUnauthorized(err, res));
    }

    create(req: Request, res: Response) {
      this.isAuthorized(req, this.roles.create)
        .then(() => super.create(req, res),
          (err) => this.sendUnauthorized(err, res));
    }

    update(req: Request, res: Response) {
      this.isAuthorized(req, this.roles.update)
        .then(() => super.update(req, res),
          (err) => this.sendUnauthorized(err, res));
    }

    del(req: Request, res: Response) {
      this.isAuthorized(req, this.roles.del)
        .then(() => super.del(req, res),
          (err) => this.sendUnauthorized(err, res));
    }
  }

  export interface IMethodAccess {
    getAll: Array<string>;
    getById: Array<string>;
    create: Array<string>;
    update: Array<string>;
    del: Array<string>;
  }

}

export = authorizedResource;
