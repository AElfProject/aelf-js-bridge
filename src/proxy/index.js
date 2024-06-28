/**
 * @file connection proxy
 * @author atom-yang
 */
import PostMessage from './postMessage.js';
import SocketIO from './socketIO.js';
import { PROXY_TYPE } from '../common/constants.js';

const PROXIES = {
  [PROXY_TYPE.postMessage]: PostMessage,
  [PROXY_TYPE.socketIo]: SocketIO
};

const defaultOptions = {
  proxyType: PROXY_TYPE.postMessage
};

export default class Proxy {
  static getProxies() {
    return PROXIES;
  }

  constructor(options = defaultOptions) {
    this.options = {
      ...defaultOptions,
      ...options
    };
    const RealProxy = PROXIES[this.options.proxyType];
    this.proxy = new RealProxy(this.options);
  }

  close() {
    return this.proxy.close();
  }

  sendMessage(request) {
    request.appId = this.options.appId;
    return this.proxy.sendMessage(request);
  }
}
