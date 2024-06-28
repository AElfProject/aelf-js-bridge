/**
 * @file base class methods
 * @author atom-yang
 */
import { PROXY_TYPE } from '../common/constants.js';

const defaultProxyType = PROXY_TYPE.postMessage;

export default class BaseProxy {
  constructor(type = defaultProxyType) {
    this.proxyType = type;
  }

  sendMessage() {
    throw new Error('You should implement this method sendMessage');
  }
}
