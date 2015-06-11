import resource = require('../../../src/resource');
import Resource = resource.Resource;

import express = require('express');
import Request = express.Request;
import Router = express.Router;
import Application = express.Application;
import Response = express.Response;

class BoomerangResource extends Resource {
  getById(req: Request, res: Response) {
    res.status(600).send(req.params.boomerangId + ' ' + this.resDef.name);
  }

  create(req: Request, res: Response) {
    res.status(600).send(req.body.message);
  }
}

export = BoomerangResource;
