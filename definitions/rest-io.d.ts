declare module 'rest-io' {
  import express = require('express');
  import Request = express.Request;
  import Response = express.Response;

  import mongoose = require('mongoose');
  import Mongoose = mongoose.Mongoose;

  function restIO(app: express.Application, config?: IRestIOConfig): RestIO;

  interface RestIO {
    resource: ResourceModule
  }

  interface IRestIOConfig {
    resources: string;
    db?: Mongoose;
  }

  interface ResourceModule {
    Resource: Resource;
    AuthorizedResource: AuthorizedResource;
    authorizedResource: AuthorizedResourceModule;
    UserResource: UserResource;
  }

  class Resource {
    constructor(resDef: IResource)

    createModel(resDef: IResource)

    toClassName(name: string)

    setupRoutes()

    getAll(req: Request, res: Response)

    buildParentSearch(req: Request)

    getById(req: Request, res: Response)

    create(req: Request, res: Response)

    update(req: Request, res: Response)

    del(req: Request, res: Response)

    errorHandler(err: Error, res: Response)
  }

  interface IResource {
    name: string;
    model: any;
    parentRef?: string;
    populate?: string;
    plural?: string;
    parentResource?: Resource;
  }

  interface AuthorizedResourceModule {
    AuthorizedResource: AuthorizedResource
    ROLES: Roles
  }

  interface Roles {
    USER: string;
    SUPER_USER: string;
    MODERATOR: string;
    ADMIN: string;
  }

  class AuthorizedResource extends Resource {
    methodAccess: IMethodAccess;

    maxDays: number;

    permissions: IMethodAccess;

    isTokenExpired(createdAt: Date)

    getRoles(id: string)

    hasAuthorizedRole(roles: Array<any>, authorizedRoles: Array<string>)

    hasAccessRightsDefined(req: Request, authorizedRoles: Array<string>)

    isAuthorized(req: Request, authorizedRoles: Array<string>)

    sendUnauthorized(error: Error, res: Response)
  }

  interface IMethodAccess {
    getAll: Array<string>;
    getById: Array<string>;
    create: Array<string>;
    update: Array<string>;
    del: Array<string>;
  }

  class UserResource extends AuthorizedResource {
    ensureBaseUserModel(model: any)

    createRoleModel()

    isSelf(req: Request)

    login(req: Request, res: Response)
  }

  export = restIO;
}
