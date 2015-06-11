var _this = this;
var English = require('yadda').localisation.English;
var library = English.library();
var chai = require('chai');
chai.use(require('chai-things'));
var expect = chai.expect;
var supertest = require('supertest');
library
    .given('the custom resource app is started', function (done) {
    _this.request = supertest('http://localhost:3030');
    done();
})
    .when('I get all boomerangs with query "(.*)"', function (query, done) {
    _this.request = _this.request.get('/api/boomerangs' + query);
    done();
})
    .when('I get a boomerang', function (done) {
    _this.request = _this.request.get('/api/boomerangs/hello');
    done();
})
    .when('I post a new boomerang with "(.*)"', function (message, done) {
    _this.request = _this.request.post('/api/boomerangs')
        .send({
        message: message
    });
    done();
})
    .then('I recieve the message "(.*)"', function (message, done) {
    _this.request
        .end(function (req, res) {
        expect(res.status).to.equal(600);
        expect(res.text).to.equal(message);
        done();
    });
});
module.exports = library;
