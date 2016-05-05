import AuthorizedResource from './authorizedResource';
import { IMethodAccess } from './authorizedResource';
import { IResource } from './resource';
import { Request, Response } from 'express';
import { Model, Document } from 'mongoose';
export default class UserResource extends AuthorizedResource {
    permissions: IMethodAccess;
    createModel(resDef: IResource): Model<Document>;
    ensureBaseUserModel(model: any): void;
    createRoleModel(): void;
    setupRoutes(): void;
    isSelf(req: Request): boolean;
    create(req: Request, res: Response): void;
    update(req: Request, res: Response): void;
    del(req: Request, res: Response): void;
    login(req: Request, res: Response): void;
}
