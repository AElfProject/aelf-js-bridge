/**
 * @file encrypt channel
 * @author atom-yang
 */
import * as elliptic from 'elliptic';
import { createCipheriv, createDecipheriv } from 'browserify-cipher';
import { randomId, serializeMessage, deserializeMessage, getUnixTimestamp } from '../utils/utils.js';
import HKDF from '../utils/hkdf.js';

const encryptAlgorithm = 'curve25519';
const cipher = 'aes-256-cbc';
const ec = elliptic.ec(encryptAlgorithm);

export default class Encrypt {
  constructor(proxy) {
    this.keypair = ec.genKeyPair();
    this.publicKey = this.keypair.getPublic();
    this.publicKeyEncoded = this.publicKey.encode('hex');
    this.proxy = proxy;
    this.encryptAlgorithm = encryptAlgorithm;
    this.remoteKeyPair = null;
    this.sharedKey = null;
    this.sharedKeyHex = null;
    this.isConnected = true;
    this.cipher = cipher;
  }

  /**
   * encrypt message
   * @param {string} data base64 decoded
   * @param {Buffer} passpharse
   * @return {{encrypted: *, iv: *}}
   */
  encrypt(data, passpharse) {
    const iv = randomId();
    const aesCipher = createCipheriv(this.cipher, passpharse, Buffer.from(iv, 'hex'));
    const encrypted = Buffer.concat([aesCipher.update(Buffer.from(data, 'base64')), aesCipher.final()]);
    return {
      encrypted: encrypted.toString('base64'),
      iv
    };
  }

  /**
   * decrypt message
   * @param {string} encrypted base64 decoded
   * @param {Buffer} passpharse
   * @param {string} iv hex
   * @return {string}
   */
  decrypt(encrypted, passpharse, iv) {
    const decipher = createDecipheriv(this.cipher, passpharse, Buffer.from(iv, 'hex'));
    const decrypted = Buffer.concat([decipher.update(Buffer.from(encrypted, 'base64')), decipher.final()]).toString('base64');
    return decrypted;
  }

  async disconnect() {
    const result = await this.sendMessage({
      action: 'disconnect',
      params: {}
    });
    if (+result.code !== 0) {
      throw new Error('disconnect error');
    }
    this.remoteKeyPair = null;
    this.remotePublicKeyEncoded = null;
    this.sharedKey = null;
    this.sharedKeyHex = null;
    this.isConnected = false;
    this.proxy.close();
    return true;
  }

  async connect() {
    try {
      const { result = {} } = await this.proxy.sendMessage({
        action: 'connect',
        params: {
          publicKey: this.publicKeyEncoded,
          encryptAlgorithm: this.encryptAlgorithm,
          cipher: this.cipher
        }
      });
      if (+result.code !== 0) {
        return false;
      }
      const { publicKey: remotePublicKey, random } = result.data;
      this.remotePublicKeyEncoded = remotePublicKey;
      // todo: 修改为对应的ec
      this.remoteKeyPair = ec.keyFromPublic(this.remotePublicKeyEncoded, 'hex');
      this.sharedKey = this.keypair.derive(this.remoteKeyPair.getPublic());
      this.sharedKeyHex = this.sharedKey.toString('hex');
      const hkdf = new HKDF('sha256', Buffer.from(random, 'hex'), this.sharedKeyHex);
      this.derivedKey = hkdf.expand();
      this.isConnected = true;
      return result.data;
    } catch (e) {
      this.isConnected = false;
      return this.isConnected;
    }
  }

  async sendMessage(message) {
    if (!this.isConnected) {
      throw new Error('You need to log in before sending messages');
    }
    const originalParams = serializeMessage({
      ...message.params,
      timestamp: getUnixTimestamp()
    });
    const { encrypted, iv } = this.encrypt(originalParams, this.derivedKey);
    const params = {
      encryptedParams: encrypted, // base64 encoded
      iv // hex encoded
    };
    const response = await this.proxy.sendMessage({
      ...message,
      params
    });
    const { result = {} } = response;
    const {
      encryptedResult, // base64 encoded
      iv: remoteIv // hex encoded
    } = result;
    const decryptedResponse = this.decrypt(encryptedResult, this.derivedKey, remoteIv);
    return deserializeMessage(decryptedResponse);
  }
}
