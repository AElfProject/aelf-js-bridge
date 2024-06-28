/**
 * @file hkdf
 * @author atom-yang
 * @link https://asecuritysite.com/encryption/HKDF
 */
import createHmac from 'create-hmac/browser.js';

export default class HKDF {
  static hashList = {
    sha256: 32,
    sha224: 54,
    sha512: 64
  };

  /**
   * @param {string} hash
   * @param {Buffer} salt
   * @param {string} initialKey
   */
  constructor(hash, salt, initialKey) {
    if (!HKDF.hashList[hash]) {
      throw new Error('not supported hash method');
    }
    this.hashMethod = hash;
    this.hashLength = HKDF.hashList[hash];
    this.salt = salt;
    this.initialKey = initialKey;
    const hmac = createHmac(hash, this.salt);
    hmac.update(this.initialKey);
    this.prk = hmac.digest();
  }

  expand(info = '', size = 32) {
    let pre = '';
    const output = [];
    const numBlocks = Math.ceil(size / this.hashLength);
    for (let i = 0; i < numBlocks; i++) {
      const hmac = createHmac(this.hashMethod, this.prk);
      hmac.update(pre);
      hmac.update(info);
      hmac.update(Buffer.alloc(1, i + 1));
      pre = hmac.digest();
      output.push(pre);
    }
    return Buffer.concat(output, size);
  }
}
