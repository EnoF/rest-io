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
    .when('I request all sub resources of "(.*)"', function (parent, done) {
    _this.request = supertest("http://localhost:5050")
        .get("/api/parents/" + createIdBasedOnName(parent) + "/subs");
    done();
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
});
module.exports = library;
