var English = require('yadda').localisation.English;
var library = English.library();
import chai = require('chai');
chai.use(require('chai-things'));
var expect = chai.expect;

import supertest = require('supertest');

library
  .given('the custom resource app is started', (done) => {
    this.request = supertest('http://localhost:3030');
    done();
  })
  .when('I get all boomerangs with query "(.*)"', (query: string, done) => {
    this.request = this.request.get('/api/boomerangs' + query);
    done();
  })
  .when('I get a boomerang', (done) => {
    this.request = this.request.get('/api/boomerangs/hello');
    done();
  })
  .when('I post a new boomerang with "(.*)"', (message: string, done) => {
    this.request = this.request.post('/api/boomerangs')
      .send({
        message: message
      });
    done();
  })
  .when('I add and retrieve a boomerang with name "(.*)"', (name: string, done) => {
    this.request = this.request.post('/api/boomerangs/add')
      .send({
        name: name
      });
    done();
  })
  .then('I recieve the message "(.*)"', (message: string, done) => {
    this.request
      .end((req: supertest.SuperTest, res: supertest.Response) => {
        expect(res.status).to.equal(600);
        expect(res.text).to.equal(message);
        done();
      });
  })
  .then('I recieve an object with name "(.*)"', (name: string, done) => {
    this.request
      .end((req: supertest.SuperTest, res: supertest.Response) => {
        expect(res.status).to.equal(707);
        expect(res.body.name).to.equal(name);
        done();
      });
  });

export = library;
