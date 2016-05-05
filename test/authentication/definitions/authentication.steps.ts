var English = require('yadda').localisation.English;
var library = English.library();
import chai = require('chai');
chai.use(require('chai-things'));
var expect = chai.expect;

import mongoose = require('mongoose');
import ObjectId = mongoose.Types.ObjectId;

import auth = require('../../../src/authentication');

import { SuperTest, Response } from 'supertest';
const supertest = require('supertest');

import { user } from '../../../examples/authentication/resources/user';

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
    this.loggedInAs = userName;
    this.authToken = auth.createAuthToken(createIdBasedOnName(userName));
    done();
  })
  .given('<Parent><Name>', (done) => done())
  .given('<Parent><(.*)>', (name: string, done) => {
    supertest('http://localhost:4000')
      .post('/api/parents')
      .set('Authorization', this.authToken)
      .send({
        _id: createIdBasedOnName(name),
        name: name
      })
      .end(() => done())
  })
  .given('<Sub><Parent><Name>', (done) => done())
  .given('<Sub><(.*)><(.*)>', (parent: string, name: string, done) => {
    supertest('http://localhost:4000')
      .post(`/api/parents/${createIdBasedOnName(parent) }/subs`)
      .set('Authorization', this.authToken)
      .send({
        _id: createIdBasedOnName(name),
        name: name
      })
      .end(() => done());
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
  .when('I create a new user with the provided credentials', (done) => {
    this.request = supertest('http://localhost:4000')
      .post('/api/users')
      .send(this.credentials);
    done();
  })
  .when('I update the username of "(.*)" to "(.*)"', (subjectName: string, newName: string, done) => {
    this.subjectName = subjectName;
    this.request = supertest('http://localhost:4000')
      .put('/api/users/' + createIdBasedOnName(subjectName))
      .set('Authorization', this.authToken)
      .send({
        userName: newName
      });
    done();
  })
  .when('I delete a user "(.*)"', (subjectName: string, done) => {
    this.subjectName = subjectName;
    this.request = supertest('http://localhost:4000')
      .del('/api/users/' + createIdBasedOnName(subjectName))
      .set('Authorization', this.authToken);
    done();
  })
  .when('I view all subs of "(.*)"', (parent: string, done) => {
    this.request = supertest('http://localhost:4000')
      .get(`/api/parents/${createIdBasedOnName(parent) }/subs`)
      .set('Authorization', this.authToken);
    done();
  })
  .when('I view sub "(.*)" of "(.*)"', (sub: string, parent: string, done) => {
    this.request = supertest('http://localhost:4000')
      .get(`/api/parents/${createIdBasedOnName(parent) }/subs/${createIdBasedOnName(sub) }`)
      .set('Authorization', this.authToken);
    done();
  })
  .when('I update sub "(.*)" of "(.*)" with "(.*)"', (sub: string, parent: string, name: string, done) => {
    this.request = supertest('http://localhost:4000')
      .put(`/api/parents/${createIdBasedOnName(parent) }/subs/${createIdBasedOnName(sub) }`)
      .send({
        name: name
      })
      .set('Authorization', this.authToken);
    done();
  })
  .when('I delete sub "(.*)" of "(.*)"', (sub: string, parent: string, done) => {
    this.request = supertest('http://localhost:4000')
      .del(`/api/parents/${createIdBasedOnName(parent) }/subs/${createIdBasedOnName(sub) }`)
      .set('Authorization', this.authToken);
    done();
  })
  .then('I expect to be logged in', (done) => {
    this.request
      .end((req: SuperTest, res: Response) => {
        expect(res.status).to.equal(200);
        expect(res.body.authToken).to.not.be.empty;
        done();
      });
  })
  .then('I expect to be unauthorized', (done) => {
    this.request
      .end((req: SuperTest, res: Response) => {
        expect(res.status).to.equal(401);
        expect(res.text).to.equal('unauthorized');
        done();
      });
  })
  .then('I can see the user details', (done) => {
    this.request
      .end((req: SuperTest, res: Response) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.ok;
        done();
      });
  })
  .then('I can not see the user details', (done) => {
    this.request
      .end((req: SuperTest, res: Response) => {
        expect(res.status).to.equal(401);
        expect(res.text).to.equal('unauthorized');
        done();
      });
  })
  .then('the new user is created', (done) => {
    this.request
      .end((req: SuperTest, res: Response) => {
        expect(res.status).to.equal(200);
        expect(res.body._id).to.be.ok;
        done();
      });
  })
  .then('the new user name is "(.*)"', (newName: string, done) => {
    this.request
      .end((req, res) => {
        expect(res.status).to.equal(200);
        supertest('http://localhost:4000')
          .get('/api/users/' + createIdBasedOnName(this.subjectName))
          .set('Authorization', auth.createAuthToken(createIdBasedOnName('EnoF')))
          .end((req, res) => {
            expect(res.body.userName).to.equal(newName);
            this.resBody = res.body;
            done();
          })
      });
  })
  .then('the password is still "(.*)"', (password: string, done) => {
    expect(this.resBody.password).to.equal(auth.encryptPassword(password));
    done();
  })
  .then('the update is prevented', (done) => {
    this.request
      .end((req, res) => {
        expect(res.status).to.equal(401);
        expect(res.text).to.equal('unauthorized');
        done();
      });
  })
  .then('the user is deleted', (done) => {
    this.request
      .end((req, res) => {
        expect(res.status).to.equal(200);
        done();
      });
  })
  .then('the user is not deleted', (done) => {
    this.request
      .end((req, res) => {
        expect(res.status).to.equal(401);
        expect(res.text).to.equal('unauthorized');
        done();
      });
  })
  .then('I expect to see sub resources "(.*)"', (subsCSV: string, done) => {
    var subs = subsCSV.split(',');
    this.request.end((req, res) => {
      expect(subs.length).to.equal(res.body.length);
      res.body.forEach((sub) => {
        expect(subs).to.include(sub.name);
      });
      done();
    });
  })
  .then('I expect to not see sub resources', (done) => {
    this.request.end((req, res) => {
      expect(res.status).to.equal(401);
      expect(res.text).to.equal('unauthorized');
      done();
    });
  })
  .then('I expect to see sub resource "(.*)"', (sub: string, done) => {
    this.request.end((req, res) => {
      expect(res.status).to.equal(200);
      expect(res.body.name).to.equal(sub);
      done();
    });
  })
  .then('I expect to not see sub resource "(.*)"', (sub: string, done) => {
    this.request.end((req, res) => {
      expect(res.status).to.equal(401);
      expect(res.text).to.equal('unauthorized');
      done();
    });
  })
  .then('I expect the sub to be updated', (done) => {
    this.request.end((req, res) => {
      expect(res.status).to.equal(200);
      done();
    });
  })
  .then('I expect the sub not to be updated', (done) => {
    this.request.end((req, res) => {
      expect(res.status).to.equal(401);
      expect(res.text).to.equal('unauthorized');
      done();
    });
  });

export = library;
