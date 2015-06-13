var authentication;
(function (authentication) {
    var HMAC = require('crypto-js/hmac-sha256');
    var AES = require('crypto-js/aes');
    function encryptPassword(password) {
        return HMAC(password, process.env.REST_IO_HMAC_KEY).toString();
    }
    authentication.encryptPassword = encryptPassword;
    function createAuthToken(userId) {
        var authToken = AES.encrypt(userId + ';' +
            new Date().getTime(), process.env.REST_IO_AES_KEY);
        return authToken.toString();
    }
    authentication.createAuthToken = createAuthToken;
})(authentication || (authentication = {}));
module.exports = authentication;
