/**
 * @file aelf isomorphism
 * @author atom-yang
 */
import MessageChannel from './messageChannel';
import Proxy from './proxy';
import {
  getUUIDForUrl
} from './utils/utils';
import StorageService from './utils/storage';
import {
  PROXY_TYPE,
  CHANNEL_TYPE,
  CHAIN_APIS,
  CHAIN_METHODS
} from './common/constants';
import Chain from './chain';
import ContractFactory from './contract';

const defaultOptions = {
  // common options
  proxyType: PROXY_TYPE.postMessage,
  channelType: CHANNEL_TYPE.sign,
  timeout: 30 * 60 * 1000,
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
    return CHAIN_APIS;
  }

  static getChainMethods() {
    return [...CHAIN_METHODS.map(v => v.methodName), 'contractAt'];
  }

  constructor(options = defaultOptions) {
    this.options = {
      ...defaultOptions,
      appId: StorageService.getAppId() || getUUIDForUrl(),
      ...options
    };
    this.request = new MessageChannel(this.options);
    this.connected = false;
    this.chain = new Chain(this);
    this.chain.contractAt = this.contractAt.bind(this);
  }

  connect() {
    return this.request.connect().then(res => {
      if (res) {
        StorageService.setAppId(this.options.appId);
      }
      return res;
    });
  }

  disconnect() {
    return this.request.disconnect().then(res => {
      this.connected = false;
      return res;
    });
  }

  async contractAt(address) {
    const list = await this.sendMessage('getContractMethods', {
      endpoint: this.options.endpoint,
      address
    });
    const r = new ContractFactory(address, list, this);
    return r.at();
  }

  async sendMessage(action, params) {
    if (!this.connected) {
      const connected = await this.connect();
      if (!connected) {
        throw new Error('Connection failed');
      }
      this.connected = true;
    }
    const res = await this.request.sendMessage({
      action,
      params
    });
    const {
      code,
      data
    } = res;
    if (+code === 0) {
      return data;
    }
    throw res;
  }

  invoke(params) {
    return this.sendMessage('invoke', {
      endpoint: this.options.endpoint,
      ...params
    });
  }

  invokeRead(params) {
    return this.sendMessage('invokeRead', {
      endpoint: this.options.endpoint,
      ...params
    });
  }

  api(params) {
    return this.sendMessage('api', {
      endpoint: this.options.endpoint,
      ...params
    });
  }

  account() {
    return this.sendMessage('account', {});
  }
}
