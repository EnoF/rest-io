var _this = this;
var English = require('yadda').localisation.English;
var library = English.library();
var chai = require('chai');
chai.use(require('chai-things'));
var expect = chai.expect;
var supertest = require('supertest');
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
    .given('<Parent><Name>', function (done) { return done(); })
    .given('<Parent><(.*)>', function (name, done) {
    supertest('http://localhost:5050')
        .post('/api/parents')
        .send({
        _id: createIdBasedOnName(name),
        name: name
    })
        .end(function () { return done(); });
})
    .given('<Ref><Name>', function (done) { return done(); })
    .given('<Ref><(.*)>', function (name, done) {
    supertest('http://localhost:5050')
        .post("/api/refs")
        .send({
        _id: createIdBasedOnName(name),
        name: name
    })
        .end(function () { return done(); });
})
    .given('<Sub><Parent><Name>', function (done) { return done(); })
    .given('<Sub><(.*)><(.*)>', function (parent, name, done) {
    supertest('http://localhost:5050')
        .post("/api/parents/" + createIdBasedOnName(parent) + "/subs")
        .send({
        _id: createIdBasedOnName(name),
        name: name
    })
        .end(function () { return done(); });
})
    .given('<Sub><Parent><Name><Ref><Name>', function (done) { return done(); })
    .given('<Sub><(.*)><(.*)><Ref><(.*)>', function (parent, name, ref, done) {
    supertest('http://localhost:5050')
        .post("/api/parents/" + createIdBasedOnName(parent) + "/subs")
        .send({
        _id: createIdBasedOnName(name),
        name: name,
        ref: createIdBasedOnName(ref)
    })
        .end(function () {
        done();
    });
})
    .when('I request all sub resources of "(.*)"', function (parent, done) {
    _this.request = supertest("http://localhost:5050")
        .get("/api/parents/" + createIdBasedOnName(parent) + "/subs");
    done();
})
    .when('I request sub resource "(.*)" of "(.*)"', function (sub, parent, done) {
    _this.request = supertest('http://localhost:5050')
        .get("/api/parents/" + createIdBasedOnName(parent) + "/subs/" + createIdBasedOnName(sub));
    done();
})
    .when('removing sub "(.*)" of (.*)', function (sub, parent, done) {
    _this.request = supertest('http://localhost:5050')
        .del("/api/parents/" + createIdBasedOnName(parent) + "/subs/" + createIdBasedOnName(sub));
    done();
})
    .when('I update sub "(.*)" of (.*) with name "(.*)"', function (sub, parent, name, done) {
    supertest('http://localhost:5050')
        .put("/api/parents/" + createIdBasedOnName(parent) + "/subs/" + createIdBasedOnName(sub))
        .send({
        name: name
    })
        .end(function (req, res) {
        expect(res.status).to.equal(200);
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
    .then('I expect to see sub resource "(.*)"', function (sub, done) {
    _this.request.end(function (req, res) {
        expect(res.status).to.equal(200);
        expect(res.body.name).to.equal(sub);
        _this.sub = res.body;
        done();
    });
})
    .then('I expect the sub to be removed', function (done) {
    _this.request.end(function (req, res) {
        expect(res.status).to.equal(200);
        done();
    });
})
    .then('I expect to see ref "(.*)" populated', function (ref, done) {
    expect(_this.sub.ref.name).to.equal(ref);
    done();
});
module.exports = library;
