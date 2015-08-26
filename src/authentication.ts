const CryptoJS = require('crypto-js');
const { HmacSHA256, AES, enc } = CryptoJS;

export function encryptPassword(password: string) {
  return HmacSHA256(password, process.env.REST_IO_HMAC_KEY).toString();
}

// add user role to auth creation
export function createAuthToken(userId: string) {
  return AES.encrypt(`${userId};${new Date().getTime()}`,
    process.env.REST_IO_AES_KEY).toString();
}

// add user role to be decrypted and broken down to separate messages
export function decryptAuthToken(authToken: string) {
  const decryptedMessage = AES.decrypt(authToken, process.env.REST_IO_AES_KEY);
  const [ id, createdAt ] = decryptedMessage.toString(enc.Utf8).split(';');

  if (!id || !createdAt) throw new Error('corrupt auth token');

  return {
    id,
    createdAt: new Date(parseInt(createdAt, 10))
  };
}
