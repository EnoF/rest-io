declare module 'rest-io' {
  import {Router, Application, Response, Request} from 'express';

  import {Mongoose, Schema, Model, Document, Types} from 'mongoose';

  function restIO(app: Application, config?: IRestIOConfig): RestIO;

  export interface RestIO {
    resource: ResourceModule
  }

  export interface IRestIOConfig {
    resources: string;
    db?: Mongoose;
  }

  export interface ResourceModule {
    authorizedResource: AuthorizedResourceModule;
    AuthorizedResource: AuthorizedResource;
    AuthorizedSubResource: AuthorizedSubResource;
    Resource: Resource;
    SubResource: SubResource;
    UserResource: UserResource;
  }

  export class Resource {
    baseUrl: string;
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

  export interface IResource {
    name: string;
    model: any;
    parentRef?: string;
    populate?: string;
    plural?: string;
    parentResource?: Resource;
  }

  export interface AuthorizedResourceModule {
    AuthorizedResource: AuthorizedResource
    ROLES: Roles
  }

  export interface Roles {
    USER: string;
    SUPER_USER: string;
    MODERATOR: string;
    ADMIN: string;
  }

  export class AuthorizedResource extends Resource {
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

  export interface IMethodAccess {
    getAll: Array<string>;
    getById: Array<string>;
    create: Array<string>;
    update: Array<string>;
    del: Array<string>;
  }

  export class UserResource extends AuthorizedResource {
    ensureBaseUserModel(model: any)

    createRoleModel()

    isSelf(req: Request)

    login(req: Request, res: Response)
  }

  export class SubResource extends Resource {
    constructor(subResDef: ISubResource)

    createProjectionQuery(req: Request)

    createPullQuery(req: Request)

    createFindQuery(req: Request)

    createSubUpdateQuery(req: Request)
  }

  export class AuthorizedSubResource extends AuthorizedResource {
    constructor(subResDef: ISubResource)

    createProjectionQuery(req: Request)

    createPullQuery(req: Request)

    createFindQuery(req: Request)

    createSubUpdateQuery(req: Request)
  }

  export interface ISubResource {
    name: string;
    plural?: string;
    parentResource: Resource;
    populate?: string;
  }
}
