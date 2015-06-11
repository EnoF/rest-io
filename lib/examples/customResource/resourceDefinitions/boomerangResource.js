var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var resource = require('../../../src/resource');
var Resource = resource.Resource;
var BoomerangResource = (function (_super) {
    __extends(BoomerangResource, _super);
    function BoomerangResource() {
        _super.apply(this, arguments);
    }
    BoomerangResource.prototype.create = function (req, res) {
        res.status(600).send(req.body.message);
    };
    return BoomerangResource;
})(Resource);
module.exports = BoomerangResource;
