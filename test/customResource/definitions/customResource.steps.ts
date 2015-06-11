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
  .when('I post a new boomerang with "(.*)"', (message: string, done) => {
    this.request = this.request.post('/api/boomerangs')
      .send({
        message: message
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
  });

export = library;
