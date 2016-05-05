import { Request, Router, Application, Response } from 'express';
import * as mongoose from 'mongoose';
import { Mongoose, Model, Document } from 'mongoose';
export declare class Resource {
    static BASE_URL: string;
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
    constructor(resDef: IResource);
    createModel(resDef: IResource): mongoose.Model<mongoose.Document>;
    toClassName(name: string): string;
    setupRoutes(): void;
    setupRecursiveRoutes(): void;
    getAll(req: Request, res: Response): void;
    buildPopulateQuery(req: Request): any;
    buildSearchQuery(req: Request): {};
    createQuery(query: string): any;
    createRegex(query: string): RegExp;
    buildParentSearch(req: Request, query: any): any;
    getById(req: Request, res: Response): void;
    create(req: Request, res: Response): void;
    update(req: Request, res: Response): void;
    del(req: Request, res: Response): void;
    errorHandler(err: Error, res: Response): void;
}
export interface IResource {
    name: string;
    model: any;
    parentRef?: string;
    populate?: string;
    plural?: string;
    parentResource?: Resource;
}
export declare function registerApp(registerApp: any, connection: Mongoose): void;
