var _this = this;
var English = require('yadda').localisation.English;
var library = English.library();
var chai = require('chai');
chai.use(require('chai-things'));
var expect = chai.expect;
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var auth = require('../../../src/authentication');
var supertest = require('supertest');
var user = require('../../../examples/authentication/resources/user');
function createIdBasedOnName(name) {
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
    .given('<User><UserName><Password>', function (done) { return done(); })
    .given('<User><(.*)><(.*)><(.*)>', function (userName, password, role, done) {
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
        .end(function () { return done(); });
})
    .given('<Role><Name>', function (done) { return done(); })
    .given('<Role><(.*)>', function (role, done) {
    user.db.model('Role').create({
        _id: new ObjectId(createIdBasedOnName(role)),
        name: role
    }, function () { return done(); });
})
    .given('I provide (.*) and (.*)', function (userName, password, done) {
    _this.credentials = {
        userName: userName,
        password: password
    };
    done();
})
    .given('I am logged in as "(.*)"', function (userName, done) {
    _this.authToken = auth.createAuthToken(createIdBasedOnName(userName));
    done();
})
    .when('I login with the provided credentials', function (done) {
    _this.request = supertest('http://localhost:4000')
        .post('/api/users/login')
        .send(_this.credentials);
    done();
})
    .when('I view user details of "(.*)"', function (userName, done) {
    _this.request = supertest('http://localhost:4000')
        .get('/api/users/' + createIdBasedOnName(userName))
        .set('Authorization', _this.authToken)
        .send(_this.credentials);
    done();
})
    .then('I expect to be logged in', function (done) {
    _this.request
        .end(function (req, res) {
        expect(res.status).to.equal(200);
        expect(res.body.authToken).to.not.be.empty;
        done();
    });
})
    .then('I expect to be unauthorized', function (done) {
    _this.request
        .end(function (req, res) {
        expect(res.status).to.equal(401);
        expect(res.text).to.equal('unauthorized');
        done();
    });
})
    .then('I can see the user details', function (done) {
    _this.request
        .end(function (req, res) {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.ok;
        done();
    });
})
    .then('I can not see the user details', function (done) {
    _this.request
        .end(function (req, res) {
        expect(res.status).to.equal(401);
        expect(res.text).to.equal('unauthorized');
        done();
    });
});
module.exports = library;
