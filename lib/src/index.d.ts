import { Mongoose } from 'mongoose';
import * as express from 'express';
import * as resource from './resource';
import UserResource from './userResource';
import * as authorizedResource from './authorizedResource';
import SubResource from './subResource';
import AuthorizedSubResource from './authorizedSubResource';
export default class RestIO {
    static authorizedResource: typeof authorizedResource;
    static UserResource: typeof UserResource;
    static AuthorizedResource: typeof authorizedResource.AuthorizedResource;
    static SubResource: typeof SubResource;
    static AuthorizedSubResource: typeof AuthorizedSubResource;
    static Resource: typeof resource.Resource;
    static ROLES: {
        USER: string;
        SUPER_USER: string;
        MODERATOR: string;
        ADMIN: string;
    };
    constructor(app: express.Application, config?: IRestIOConfig);
}
export interface IRestIOConfig {
    resources: string;
    db?: Mongoose;
}
