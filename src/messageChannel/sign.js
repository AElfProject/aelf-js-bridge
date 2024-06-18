/**
 * @file sign message with keypair
 * @author atom-yang
 */
import * as elliptic from 'elliptic';
import { getUnixTimestamp, serializeMessage, deserializeMessage } from '../utils/utils.js';

const encryptAlgorithm = 'secp256k1';
const ec = elliptic.ec(encryptAlgorithm);

export default class Sign {
  constructor(proxy) {
    this.keypair = ec.genKeyPair();
    this.publicKey = this.keypair.getPublic();
    this.publicKeyEncoded = this.publicKey.encode('hex');
    this.proxy = proxy;
    this.encryptAlgorithm = encryptAlgorithm;
    this.remoteKeyPair = null;
    this.isConnected = false;
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
    this.isConnected = false;
    this.proxy.close();
    return true;
  }

  async connect() {
    const timestamp = getUnixTimestamp();
    const signature = this.sign(Buffer.from(String(timestamp)));
    try {
      const { result = {} } = await this.proxy.sendMessage({
        action: 'connect',
        params: {
          publicKey: this.publicKeyEncoded,
          timestamp,
          encryptAlgorithm: this.encryptAlgorithm,
          signature
        }
      });
      if (+result.code !== 0) {
        return false;
      }
      const { random: remoteRandom, signature: remoteSignature, publicKey: remotePublicKey } = result.data;
      this.remotePublicKeyEncoded = remotePublicKey;
      this.remoteKeyPair = ec.keyFromPublic(remotePublicKey, 'hex');
      const isConnected = this.verify(remoteRandom, remoteSignature);
      if (!isConnected) {
        throw isConnected;
      }
      this.isConnected = isConnected;
      return result.data;
    } catch (e) {
      this.isConnected = false;
      throw e;
    }
  }

  sign(msg) {
    const signedMsg = this.keypair.sign(msg);
    return [signedMsg.r.toString(16, 64), signedMsg.s.toString(16, 64), `0${signedMsg.recoveryParam.toString()}`].join('');
  }

  verify(msg, signature) {
    const r = signature.slice(0, 64);
    const s = signature.slice(64, 128);
    const recoveryParam = signature.slice(128);
    const signatureObj = {
      r,
      s,
      recoveryParam
    };
    try {
      const result = this.remoteKeyPair.verify(msg, signatureObj);
      return result;
    } catch (e) {
      return false;
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
    const signature = this.sign(Buffer.from(originalParams, 'base64'));
    const params = {
      signature,
      originalParams
    };
    const response = await this.proxy.sendMessage({
      ...message,
      params
    });
    const { result = {} } = response;
    const { originalResult, signature: remoteSignature } = result;
    const responseData = deserializeMessage(originalResult);
    if (!this.verify(Buffer.from(originalResult, 'base64'), remoteSignature)) {
      throw new Error(`Verify response error, the response ${JSON.stringify(responseData, null, 2)} is not valid`);
    }
    return responseData;
  }
}
