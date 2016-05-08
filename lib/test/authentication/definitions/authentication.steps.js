"use strict";
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
var user_1 = require('../../../examples/authentication/resources/user');
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
    user_1.user.db.model('Role').create({
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
    _this.loggedInAs = userName;
    _this.authToken = auth.createAuthToken(createIdBasedOnName(userName));
    done();
})
    .given('<Parent><Name>', function (done) { return done(); })
    .given('<Parent><(.*)>', function (name, done) {
    supertest('http://localhost:4000')
        .post('/api/parents')
        .set('Authorization', _this.authToken)
        .send({
        _id: createIdBasedOnName(name),
        name: name
    })
        .end(function () { return done(); });
})
    .given('<Sub><Parent><Name>', function (done) { return done(); })
    .given('<Sub><(.*)><(.*)>', function (parent, name, done) {
    supertest('http://localhost:4000')
        .post("/api/parents/" + createIdBasedOnName(parent) + "/subs")
        .set('Authorization', _this.authToken)
        .send({
        _id: createIdBasedOnName(name),
        name: name
    })
        .end(function () { return done(); });
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
    .when('I create a new user with the provided credentials', function (done) {
    _this.request = supertest('http://localhost:4000')
        .post('/api/users')
        .send(_this.credentials);
    done();
})
    .when('I update the username of "(.*)" to "(.*)"', function (subjectName, newName, done) {
    _this.subjectName = subjectName;
    _this.request = supertest('http://localhost:4000')
        .put('/api/users/' + createIdBasedOnName(subjectName))
        .set('Authorization', _this.authToken)
        .send({
        userName: newName
    });
    done();
})
    .when('I delete a user "(.*)"', function (subjectName, done) {
    _this.subjectName = subjectName;
    _this.request = supertest('http://localhost:4000')
        .del('/api/users/' + createIdBasedOnName(subjectName))
        .set('Authorization', _this.authToken);
    done();
})
    .when('I view all subs of "(.*)"', function (parent, done) {
    _this.request = supertest('http://localhost:4000')
        .get("/api/parents/" + createIdBasedOnName(parent) + "/subs")
        .set('Authorization', _this.authToken);
    done();
})
    .when('I view sub "(.*)" of "(.*)"', function (sub, parent, done) {
    _this.request = supertest('http://localhost:4000')
        .get("/api/parents/" + createIdBasedOnName(parent) + "/subs/" + createIdBasedOnName(sub))
        .set('Authorization', _this.authToken);
    done();
})
    .when('I update sub "(.*)" of "(.*)" with "(.*)"', function (sub, parent, name, done) {
    _this.request = supertest('http://localhost:4000')
        .put("/api/parents/" + createIdBasedOnName(parent) + "/subs/" + createIdBasedOnName(sub))
        .send({
        name: name
    })
        .set('Authorization', _this.authToken);
    done();
})
    .when('I delete sub "(.*)" of "(.*)"', function (sub, parent, done) {
    _this.request = supertest('http://localhost:4000')
        .del("/api/parents/" + createIdBasedOnName(parent) + "/subs/" + createIdBasedOnName(sub))
        .set('Authorization', _this.authToken);
    done();
})
    .when('I am updating user "(.*)" with "(.*)"', function (subject, role, done) {
    _this.request = supertest('http://localhost:4000')
        .put("/api/users/" + createIdBasedOnName(subject))
        .set('Authorization', _this.authToken)
        .send({
        roles: [role]
    })
        .end(function (req, res) {
        done();
    });
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
})
    .then('the new user is created', function (done) {
    _this.request
        .end(function (req, res) {
        expect(res.status).to.equal(200);
        expect(res.body._id).to.be.ok;
        done();
    });
})
    .then('the new user name is "(.*)"', function (newName, done) {
    _this.request
        .end(function (req, res) {
        expect(res.status).to.equal(200);
        supertest('http://localhost:4000')
            .get('/api/users/' + createIdBasedOnName(_this.subjectName))
            .set('Authorization', auth.createAuthToken(createIdBasedOnName('EnoF')))
            .end(function (req, res) {
            expect(res.body.userName).to.equal(newName);
            _this.resBody = res.body;
            done();
        });
    });
})
    .then('the password is still "(.*)"', function (password, done) {
    expect(_this.resBody.password).to.equal(auth.encryptPassword(password));
    done();
})
    .then('the update is prevented', function (done) {
    _this.request
        .end(function (req, res) {
        expect(res.status).to.equal(401);
        expect(res.text).to.equal('unauthorized');
        done();
    });
})
    .then('the user is deleted', function (done) {
    _this.request
        .end(function (req, res) {
        expect(res.status).to.equal(200);
        done();
    });
})
    .then('the user is not deleted', function (done) {
    _this.request
        .end(function (req, res) {
        expect(res.status).to.equal(401);
        expect(res.text).to.equal('unauthorized');
        done();
    });
})
    .then('I expect to see sub resources "(.*)"', function (subsCSV, done) {
    var subs = subsCSV.split(',');
    _this.request.end(function (req, res) {
        expect(subs.length).to.equal(res.body.length);
        res.body.forEach(function (sub) {
            expect(subs).to.include(sub.name);
        });
        done();
    });
})
    .then('I expect to not see sub resources', function (done) {
    _this.request.end(function (req, res) {
        expect(res.status).to.equal(401);
        expect(res.text).to.equal('unauthorized');
        done();
    });
})
    .then('I expect to see sub resource "(.*)"', function (sub, done) {
    _this.request.end(function (req, res) {
        expect(res.status).to.equal(200);
        expect(res.body.name).to.equal(sub);
        done();
    });
})
    .then('I expect to not see sub resource "(.*)"', function (sub, done) {
    _this.request.end(function (req, res) {
        expect(res.status).to.equal(401);
        expect(res.text).to.equal('unauthorized');
        done();
    });
})
    .then('I expect the sub to be updated', function (done) {
    _this.request.end(function (req, res) {
        expect(res.status).to.equal(200);
        done();
    });
})
    .then('I expect the sub not to be updated', function (done) {
    _this.request.end(function (req, res) {
        expect(res.status).to.equal(401);
        expect(res.text).to.equal('unauthorized');
        done();
    });
})
    .then('user "(.*)" should have "(.*)" role', function (user, role, done) {
    _this.request = supertest('http://localhost:4000')
        .get("/api/users/" + createIdBasedOnName(user) + "?populate=roles")
        .set('Authorization', _this.authToken)
        .end(function (req, res) {
        if (!!res.body.roles) {
            var roleFound = false;
            res.body.roles.forEach(function (currentRole) {
                if (currentRole.name === role) {
                    roleFound = true;
                }
            });
            expect(roleFound).to.equal(true);
        }
        else if (!!role) {
            throw new Error('No roles found');
        }
        done();
    });
});
module.exports = library;
