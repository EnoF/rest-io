module authentication {
  var HMAC = require('crypto-js/hmac-sha256');
  var AES = require('crypto-js/aes');

  export function encryptPassword(password: string) {
    return HMAC(password, process.env.REST_IO_HMAC_KEY).toString();
  }

  export function createAuthToken(userId: string) {
    var authToken = AES.encrypt(userId + ';' +
      new Date().getTime(), process.env.REST_IO_AES_KEY);
    return authToken.toString();
  }
}

export = authentication;
