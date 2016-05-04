const CryptoJS = require('crypto-js');
const { HmacSHA256, AES, enc } = CryptoJS;

export function encryptPassword(password: string) {
  return HmacSHA256(password, process.env.REST_IO_HMAC_KEY).toString();
}

export function createAuthToken(userId: string) {
  const authToken = AES.encrypt(`${userId};${new Date().getTime()}`,
    process.env.REST_IO_AES_KEY);
  return authToken.toString();
}

export function decryptAuthToken(authToken: string) {
  const decryptedMessage = AES.decrypt(authToken, process.env.REST_IO_AES_KEY);
  const [ id, createdAt ] = decryptedMessage.toString(enc.Utf8).split(';');
  if (!id || !createdAt) {
    throw new Error('corrupt auth token');
  }
  return {
    id,
    createdAt: new Date(parseInt(createdAt, 10))
  };
}
