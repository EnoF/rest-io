var English = require('yadda').localisation.English;
var library = English.library();
import chai = require('chai');
chai.use(require('chai-things'));
var expect = chai.expect;

import supertest = require('supertest');

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
  .given('<Parent><Name>', (done) => done())
  .given('<Parent><(.*)>', (name: string, done) => {
    supertest('http://localhost:5050')
      .post('/api/parents')
      .send({
        _id: createIdBasedOnName(name),
        name: name
      })
      .end(() => done())
  })
  .given('<Ref><Name>', (done) => done())
  .given('<Ref><(.*)>', (name: string, done) => {
    supertest('http://localhost:5050')
      .post(`/api/refs`)
      .send({
        _id: createIdBasedOnName(name),
        name: name
      })
      .end(() => done());
  })
  .given('<Sub><Parent><Name>', (done) => done())
  .given('<Sub><(.*)><(.*)>', (parent: string, name: string, done) => {
    supertest('http://localhost:5050')
      .post(`/api/parents/${createIdBasedOnName(parent) }/subs`)
      .send({
        _id: createIdBasedOnName(name),
        name: name
      })
      .end(() => done());
  })
  .given('<Sub><Parent><Name><Ref><Name>', (done) => done())
  .given('<Sub><(.*)><(.*)><Ref><(.*)>', (parent: string, name: string, ref: string, done) => {
    supertest('http://localhost:5050')
      .post(`/api/parents/${createIdBasedOnName(parent) }/subs`)
      .send({
        _id: createIdBasedOnName(name),
        name: name,
        ref: createIdBasedOnName(ref)
      })
      .end(() => {
        done()
      });
  })
  .when('I request all sub resources of "(.*)"', (parent: string, done) => {
    this.request = supertest(`http://localhost:5050`)
      .get(`/api/parents/${createIdBasedOnName(parent) }/subs`);
    done();
  })
  .when('I request sub resource "(.*)" of "(.*)"', (sub: string, parent: string, done) => {
    this.request = supertest('http://localhost:5050')
      .get(`/api/parents/${createIdBasedOnName(parent) }/subs/${createIdBasedOnName(sub) }`);
    done();
  })
  .when('removing sub "(.*)" of (.*)', (sub: string, parent: string, done) => {
    this.request = supertest('http://localhost:5050')
      .del(`/api/parents/${createIdBasedOnName(parent) }/subs/${createIdBasedOnName(sub) }`);
    done();
  })
  .when('I update sub "(.*)" of (.*) with name "(.*)"', (sub: string, parent: string, name: string, done) => {
    supertest('http://localhost:5050')
      .put(`/api/parents/${createIdBasedOnName(parent) }/subs/${createIdBasedOnName(sub) }`)
      .send({
        name: name
      })
      .end((req, res) => {
        expect(res.status).to.equal(200);
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
  .then('I expect to see sub resource "(.*)"', (sub: string, done) => {
    this.request.end((req, res) => {
      expect(res.status).to.equal(200);
      expect(res.body.name).to.equal(sub);
      this.sub = res.body;
      done();
    });
  })
  .then('I expect the sub to be removed', (done) => {
    this.request.end((req, res) => {
      expect(res.status).to.equal(200);
      done();
    });
  })
  .then('I expect to see ref "(.*)" populated', (ref: string, done) => {
    expect(this.sub.ref.name).to.equal(ref);
    done();
  });

module.exports = library;
