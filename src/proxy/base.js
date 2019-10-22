/**
 * @file base class methods
 * @author atom-yang
 */
import {
  PROXY_TYPE
} from '../common/constants';

const defaultProxyType = PROXY_TYPE.postMessage;

export default class BaseProxy {
  constructor(type = defaultProxyType) {
    this.proxyType = type;
  }

  serializeMessage() {
    throw new Error('You should implement this method serializeMessage');
  }

  deserializeMessage() {
    throw new Error('You should implement this method deserializeMessage');
  }
}
