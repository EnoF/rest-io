var authentication;
(function (authentication) {
    var CryptoJS = require('crypto-js');
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
    function decryptAuthToken(authToken) {
        var decryptedMessage = AES.decrypt(authToken, process.env.REST_IO_AES_KEY);
        var brokenMessage = decryptedMessage.toString(CryptoJS.enc.Utf8).split(';');
        if (brokenMessage.length !== 2) {
            throw new Error('corrupt auth token');
        }
        return {
            id: brokenMessage[0],
            createdAt: new Date(parseInt(brokenMessage[1], 10))
        };
    }
    authentication.decryptAuthToken = decryptAuthToken;
})(authentication || (authentication = {}));
module.exports = authentication;
