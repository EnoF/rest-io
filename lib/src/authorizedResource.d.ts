import { Resource } from './resource';
import { Request, Response } from 'express';
import * as mongoose from 'mongoose';
export declare const ROLES: {
    USER: string;
    SUPER_USER: string;
    MODERATOR: string;
    ADMIN: string;
};
export default class AuthorizedResource extends Resource {
    methodAccess: IMethodAccess;
    maxDays: number;
    static ROLES: {
        USER: string;
        SUPER_USER: string;
        MODERATOR: string;
        ADMIN: string;
    };
    permissions: IMethodAccess;
    isTokenExpired(createdAt: Date): boolean;
    getRoles(id: string): mongoose.Promise<mongoose.Document>;
    hasAuthorizedRole(roles: Array<any>, authorizedRoles: Array<string>): boolean;
    hasAccessRightsDefined(req: Request, authorizedRoles: Array<string>): mongoose.Promise<{}>;
    isAuthorized(req: Request, authorizedRoles: Array<string>): mongoose.Promise<{}>;
    sendUnauthorized(error: Error, res: Response): void;
    baseGetAll: (req: Request, res: Response) => void;
    baseGetById: (req: Request, res: Response) => void;
    baseCreate: (req: Request, res: Response) => void;
    baseUpdate: (req: Request, res: Response) => void;
    baseDel: (req: Request, res: Response) => void;
    getAll(req: Request, res: Response): void;
    getById(req: Request, res: Response): void;
    create(req: Request, res: Response): void;
    update(req: Request, res: Response): void;
    del(req: Request, res: Response): void;
}
export interface IMethodAccess {
    getAll: Array<string>;
    getById: Array<string>;
    create: Array<string>;
    update: Array<string>;
    del: Array<string>;
}
