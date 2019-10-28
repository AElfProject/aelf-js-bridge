/**
 * @file index
 * @author
 */
import MessageChannel from './messageChannel';
import Proxy from './proxy';
import {
  randomId
} from './utils/utils';
import StorageService from './utils/storage';
import {
  PROXY_TYPE,
  CHANNEL_TYPE,
  CHAIN_APIS
} from './common/constants';

const defaultOptions = {
  // common options
  proxyType: PROXY_TYPE.postMessage,
  channelType: CHANNEL_TYPE.sign,
  timeout: 3000,
  endpoint: '',
  // for post message
  origin: '*',
  checkoutInterval: 200,
  urlPrefix: 'aelf://aelf.io?params=',
  // for socket.io
  socketUrl: 'http://localhost:50845',
  socketPath: '',
  messageType: 'bridge'
};

export default class Bridge {
  static getProxies() {
    Proxy.getProxies();
  }

  static getChannels() {
    return MessageChannel.getChannels();
  }

  static getChainApis() {
    return Object.keys(CHAIN_APIS);
  }

  constructor(options = defaultOptions) {
    this.options = {
      ...defaultOptions,
      appId: StorageService.getAppId() || randomId(),
      ...options
    };
    this.request = new MessageChannel(this.options);
  }

  connect() {
    return this.request.connect();
  }

  disconnect() {
    return this.request.disconnect();
  }

  sendMessage(action, params) {
    return this.request.sendMessage({
      action,
      params
    });
  }

  invoke(params) {
    return this.request.sendMessage({
      action: 'invoke',
      params: {
        endpoint: this.options.endpoint,
        ...params
      }
    });
  }

  invokeRead(params) {
    return this.request.sendMessage({
      action: 'invokeRead',
      params: {
        endpoint: this.options.endpoint,
        ...params
      }
    });
  }

  api(params) {
    return this.request.sendMessage({
      action: 'api',
      params: {
        endpoint: this.options.endpoint,
        ...params
      }
    });
  }

  account() {
    return this.request.sendMessage({
      action: 'account',
      params: {}
    });
  }
}
