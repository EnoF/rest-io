import { Resource, IResource } from './resource';
import { Request, Router, Application, Response } from 'express';

import * as auth from './authentication';
import * as mongoose from 'mongoose';

export const ROLES = {
  USER: 'USER',
  SUPER_USER: 'SUPER_USER',
  MODERATOR: 'MODERATOR',
  ADMIN: 'ADMIN'
};

export default class AuthorizedResource extends Resource {
  methodAccess: IMethodAccess;
  maxDays: number = 7;

  permissions: IMethodAccess = {
    getAll: [ROLES.USER, ROLES.SUPER_USER, ROLES.MODERATOR, ROLES.ADMIN],
    getById: [ROLES.USER, ROLES.SUPER_USER, ROLES.MODERATOR, ROLES.ADMIN],
    create: [ROLES.USER, ROLES.SUPER_USER, ROLES.MODERATOR, ROLES.ADMIN],
    update: [ROLES.USER, ROLES.SUPER_USER, ROLES.MODERATOR, ROLES.ADMIN],
    del: [ROLES.USER, ROLES.SUPER_USER, ROLES.MODERATOR, ROLES.ADMIN]
  };

  isTokenExpired(createdAt: Date) {
    const maxTokenLifeTime = new Date();
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
    let hasRole = false;
    roles.forEach(({ name }) => {
      authorizedRoles.forEach((authRole: string) => {
        if (name === authRole) {
          hasRole = true;
        }
      });
    });
    return hasRole;
  }

  hasAccessRightsDefined(req: Request, authorizedRoles: Array<string>) {
    const promise = new mongoose.Promise();
    const authToken = req.header('Authorization');
    if (authorizedRoles.length === 0) {
      promise.resolve(null, null);
      return promise;
    }
  }

  isAuthorized(req: Request, authorizedRoles: Array<string>) {
    const promise = new mongoose.Promise();
    const authToken = req.header('Authorization');
    if (authorizedRoles.length === 0) {
      promise.resolve(null, null);
      return promise;
    } else if (!authToken) {
      promise.resolve(new Error('no token found'), null);
      return promise;
    }
    const { id, createdAt } = auth.decryptAuthToken(authToken);
    return this.getRoles(id)
      .then(({ roles }: any) => {
        if (this.isTokenExpired(createdAt)) {
          throw new Error('token expired');
        }
        return roles;
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
    this.isAuthorized(req, this.permissions.getAll)
      .then(() => super.getAll(req, res),
        (err) => this.sendUnauthorized(err, res));
  }

  getById(req: Request, res: Response) {
    this.isAuthorized(req, this.permissions.getById)
      .then(() => super.getById(req, res),
        (err) => this.sendUnauthorized(err, res));
  }

  create(req: Request, res: Response) {
    this.isAuthorized(req, this.permissions.create)
      .then(() => super.create(req, res),
        (err) => this.sendUnauthorized(err, res));
  }

  update(req: Request, res: Response) {
    this.isAuthorized(req, this.permissions.update)
      .then(() => super.update(req, res),
        (err) => this.sendUnauthorized(err, res));
  }

  del(req: Request, res: Response) {
    this.isAuthorized(req, this.permissions.del)
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
