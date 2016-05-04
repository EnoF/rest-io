"use strict";
var CryptoJS = require('crypto-js');
var HmacSHA256 = CryptoJS.HmacSHA256, AES = CryptoJS.AES, enc = CryptoJS.enc;
function encryptPassword(password) {
    return HmacSHA256(password, process.env.REST_IO_HMAC_KEY).toString();
}
exports.encryptPassword = encryptPassword;
function createAuthToken(userId) {
    var authToken = AES.encrypt(userId + ';' +
        new Date().getTime(), process.env.REST_IO_AES_KEY);
    return authToken.toString();
}
exports.createAuthToken = createAuthToken;
function decryptAuthToken(authToken) {
    var decryptedMessage = AES.decrypt(authToken, process.env.REST_IO_AES_KEY);
    var _a = decryptedMessage.toString(enc.Utf8).split(';'), id = _a[0], createdAt = _a[1];
    if (!id || !createdAt) {
        throw new Error('corrupt auth token');
    }
    return {
        id: id,
        createdAt: new Date(parseInt(createdAt, 10))
    };
}
exports.decryptAuthToken = decryptAuthToken;
