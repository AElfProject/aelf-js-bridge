/**
 * @file message channel
 * @author atom-yang
 */
import Proxy from '../proxy/index.js';
import Sign from './sign.js';
import Encrypt from './encrypt.js';
import { CHANNEL_TYPE } from '../common/constants.js';

const MESSAGE_CHANNELS = {
  [CHANNEL_TYPE.sign]: Sign,
  [CHANNEL_TYPE.encrypt]: Encrypt
};

const defaultOptions = {
  channelType: CHANNEL_TYPE.sign
};

export default class MessageChannel {
  static getChannels() {
    return MESSAGE_CHANNELS;
  }

  constructor(options = defaultOptions) {
    this.options = {
      ...defaultOptions,
      ...options
    };
    this.proxy = new Proxy(this.options);
    const RealMessageChannel = MESSAGE_CHANNELS[this.options.channelType];
    this.channel = new RealMessageChannel(this.proxy);
  }

  sendMessage(message) {
    return this.channel.sendMessage(message);
  }

  connect() {
    return this.channel.connect();
  }

  disconnect() {
    return this.channel.disconnect();
  }
}
