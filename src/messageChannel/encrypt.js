/**
 * @file encrypt channel
 * @author atom-yang
 */
import * as elliptic from 'elliptic';
import { createCipheriv, createDecipheriv } from 'browserify-cipher';
import {
  randomId,
  serializeMessage,
  deserializeMessage
} from '../utils/utils';

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
    this.remotePublicKeyEncoded = null;
    this.remoteKeyPair = null;
    this.sharedKey = null;
    this.sharedKeyHex = null;
    this.isConnected = true;
    this.cipher = cipher;
  }

  encrypt(data, passpharse) {
    const iv = randomId();
    const aesCipher = createCipheriv(this.cipher, passpharse.slice(0, 32), Buffer.from(iv, 'hex'));
    const encrypted = Buffer.concat([
      aesCipher.update(Buffer.from(data, 'base64')),
      aesCipher.final()
    ]);
    return {
      encrypted: encrypted.toString('base64'),
      iv
    };
  }

  decrypt(encrypted, passpharse, iv) {
    const decipher = createDecipheriv(this.cipher, passpharse.slice(0, 32), Buffer.from(iv, 'hex'));
    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(encrypted, 'base64')),
      decipher.final()
    ]).toString('base64');
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
      const {
        publicKey: remotePublicKey
      } = result.data;
      this.remotePublicKeyEncoded = remotePublicKey;
      this.remoteKeyPair = ec.keyFromPublic(remotePublicKey, 'hex');
      this.sharedKey = this.keypair.derive(this.remoteKeyPair.getPublic());
      this.sharedKeyHex = this.sharedKey.toString('hex');
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
    const originalParams = serializeMessage(message.params);
    const {
      encryptedParams,
      iv
    } = this.encrypt(originalParams, Buffer.from(this.sharedKeyHex, 'hex'));
    const params = {
      encryptedParams, // base64 encoded
      iv // hex encoded
    };
    const response = await this.proxy.sendMessage({
      ...message,
      params
    });
    const {
      result = {}
    } = response;
    const {
      encryptedResult, // base64 encoded
      iv: remoteIv // hex encoded
    } = result;
    const decryptedResponse = this.decrypt(encryptedResult, Buffer.from(this.sharedKeyHex, 'hex'), remoteIv);
    return deserializeMessage(decryptedResponse);
  }
}
