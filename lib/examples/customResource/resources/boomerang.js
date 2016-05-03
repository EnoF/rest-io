"use strict";
var BoomerangResource = require('../resourceDefinitions/boomerangResource');
var boomerang = new BoomerangResource({
    name: 'boomerang',
    model: {
        name: String
    }
});
module.exports = boomerang;
