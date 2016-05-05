import { Resource, IResource } from './resource';
import { Request, Response } from 'express';
import { Document, Model } from 'mongoose';
export default class SubResource extends Resource {
    constructor(subResDef: ISubResource);
    createModel(resDef: IResource): Model<Document>;
    getAll(req: Request, res: Response): void;
    getById(req: Request, res: Response): void;
    createProjectionQuery(req: Request): {};
    create(req: Request, res: Response): void;
    del(req: Request, res: Response): void;
    createPullQuery(req: Request): {};
    update(req: Request, res: Response): void;
    createFindQuery(req: Request): {
        _id: any;
    };
    createSubUpdateQuery(req: Request): {};
}
export interface ISubResource {
    name: string;
    plural?: string;
    parentResource: Resource;
    populate?: string;
}
