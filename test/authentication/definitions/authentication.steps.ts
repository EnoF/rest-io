var English = require('yadda').localisation.English;
var library = English.library();
import chai = require('chai');
chai.use(require('chai-things'));
var expect = chai.expect;

import mongoose = require('mongoose');
import ObjectId = mongoose.Types.ObjectId;

import auth = require('../../../src/authentication');

import supertest = require('supertest');

import user = require('../../../examples/authentication/resources/user');

function createIdBasedOnName(name: string) {
  var id = convertToHex(name);
  var i = 0;
  while (id.length < 24) {
    id += i++;
    if (i > 9) {
      i = 0;
    }
  }
  return id;
}

function convertToHex(str) {
  var hex = '';
  for (var i = 0; i < str.length; i++) {
    hex += '' + str.charCodeAt(i).toString(16);
  }
  return hex;
}

library
  .given('<User><UserName><Password>', (done) => done())
  .given('<User><(.*)><(.*)><(.*)>', (userName: string, password: string, role: string, done) => {
    var roles = [];
    if (!!role) {
      roles.push(createIdBasedOnName(role));
    }
    supertest('http://localhost:4000')
      .post('/api/users')
      .send({
        _id: createIdBasedOnName(userName),
        userName: userName,
        password: password,
        roles: roles
      })
      .end(() => done());
  })
  .given('<Role><Name>', (done) => done())
  .given('<Role><(.*)>', (role: string, done) => {
    user.db.model('Role').create({
      _id: new ObjectId(createIdBasedOnName(role)),
      name: role
    }, () => done());
  })
  .given('I provide (.*) and (.*)', (userName: string, password: string, done) => {
    this.credentials = {
      userName: userName,
      password: password
    };
    done();
  })
  .given('I am logged in as "(.*)"', (userName: string, done) => {
    this.authToken = auth.createAuthToken(createIdBasedOnName(userName));
    done();
  })
  .when('I login with the provided credentials', (done) => {
    this.request = supertest('http://localhost:4000')
      .post('/api/users/login')
      .send(this.credentials);
    done();
  })
  .when('I view user details of "(.*)"', (userName: string, done) => {
    this.request = supertest('http://localhost:4000')
      .get('/api/users/' + createIdBasedOnName(userName))
      .set('Authorization', this.authToken)
      .send(this.credentials);
    done();
  })
  .then('I expect to be logged in', (done) => {
    this.request
      .end((req: supertest.SuperTest, res: supertest.Response) => {
        expect(res.status).to.equal(200);
        expect(res.body.authToken).to.not.be.empty;
        done();
      });
  })
  .then('I expect to be unauthorized', (done) => {
    this.request
      .end((req: supertest.SuperTest, res: supertest.Response) => {
        expect(res.status).to.equal(401);
        expect(res.text).to.equal('unauthorized');
        done();
      });
  })
  .then('I can see the user details', (done) => {
    this.request
      .end((req: supertest.SuperTest, res: supertest.Response) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.ok;
        done();
      });
  })
  .then('I can not see the user details', (done) => {
    this.request
      .end((req: supertest.SuperTest, res: supertest.Response) => {
        expect(res.status).to.equal(401);
        expect(res.text).to.equal('unauthorized');
        done();
      });
  });

export = library;
