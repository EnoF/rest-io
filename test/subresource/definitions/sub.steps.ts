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
  .when('I request all sub resources of "(.*)"', (parent: string, done) => {
    this.request = supertest(`http://localhost:5050`)
      .get(`/api/parents/${createIdBasedOnName(parent) }/subs`);
    done();
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
  });

module.exports = library;
