/**
 * @file connection proxy
 * @author atom-yang
 */
import PostMessage from './postMessage';
import SocketIO from './socketIO';
import WS from './ws';
import { PROXY_TYPE } from '../common/constants';
import StorageService from '../utils/storage';

const PROXIES = {
  [PROXY_TYPE.postMessage]: PostMessage,
  [PROXY_TYPE.socketIo]: SocketIO,
  [PROXY_TYPE.webSocket]: WS
};

const defaultOptions = {
  proxyType: PROXY_TYPE.postMessage
};

export default class Proxy {
  static getProxies() {
    return PROXIES;
  }

  constructor(
    options = defaultOptions
  ) {
    this.options = {
      ...defaultOptions,
      ...options
    };
    const RealProxy = PROXIES[this.options.proxyType];
    this.proxy = new RealProxy(this.options);
  }

  sendMessage(request) {
    request.appId = this.options.appId;
    return this.proxy.sendMessage(request).then(res => {
      if (res) {
        StorageService.setAppId(this.options.appId);
      }
      return res;
    });
  }
}
