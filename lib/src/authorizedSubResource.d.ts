import AuthorizedResource from './authorizedResource';
import { Resource, IResource } from './resource';
import { Request, Response } from 'express';
import { Model, Document } from 'mongoose';
export default class AuthorizedSubResource extends AuthorizedResource {
    constructor(subResDef: ISubResource);
    createModel(resDef: IResource): Model<Document>;
    getAll(req: Request, res: Response): void;
    getById(req: Request, res: Response): void;
    create(req: Request, res: Response): void;
    update(req: Request, res: Response): void;
    del(req: Request, res: Response): void;
    createProjectionQuery(req: Request): any;
    createPullQuery(req: Request): any;
    createFindQuery(req: Request): any;
    createSubUpdateQuery(req: Request): any;
}
export interface ISubResource {
    name: string;
    plural?: string;
    parentResource: Resource;
    populate?: string;
}
