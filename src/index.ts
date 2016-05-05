import { Mongoose } from 'mongoose';
import * as express from 'express';
import * as resource from './resource';
import { Resource } from './resource';
import * as bodyParser from 'body-parser';
import UserResource from './userResource';
import * as authorizedResource from './authorizedResource';
import AuthorizedResource from './authorizedResource';
import SubResource from './subResource';
import AuthorizedSubResource from './authorizedSubResource';
const autoloader = require('auto-loader');

export default class RestIO {
  static authorizedResource = authorizedResource;
  static UserResource = UserResource;
  static AuthorizedResource = AuthorizedResource;
  static SubResource = SubResource;
  static AuthorizedSubResource = AuthorizedSubResource;
  static Resource = Resource;

  constructor(app: express.Application, config?: IRestIOConfig) {
    app.use(bodyParser.json());
    resource.registerApp(app, config.db);
    if (!!config) {
      const resources: Object = autoloader.load(config.resources);
      for (let i in resources) {
        if (resources.hasOwnProperty(i)) {
          // access to trigger getter of auto-loader
          resources[i];
        }
      }
    }
    return resource;
  }
}

export interface IRestIOConfig {
  resources: string;
  db?: Mongoose;
}
