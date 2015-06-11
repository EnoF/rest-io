import resource = require('../../../src/resource');
import Resource = resource.Resource;

import express = require('express');
import Request = express.Request;
import Router = express.Router;
import Application = express.Application;
import Response = express.Response;

class BoomerangResource extends Resource {
  setupRoutes() {
    super.setupRoutes();
    this.router
      .route(this.url + '/add')
      .post((req, res) => this.addAndRetrieve(req, res));
  }

  getAll(req: Request, res: Response) {
    res.status(600).send(req.query.name);
  }

  getById(req: Request, res: Response) {
    res.status(600).send(req.params.boomerangId + ' ' + this.resDef.name);
  }

  create(req: Request, res: Response) {
    res.status(600).send(req.body.message);
  }

  addAndRetrieve(req: Request, res: Response) {
    this.model.create(req.body)
      .then((boomerang) => {
        res.status(707).send(boomerang);
      });
  }
}

export = BoomerangResource;
