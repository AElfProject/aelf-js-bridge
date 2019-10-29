/**
 * @file connection with postMessage
 * @author atom-yang
 */
import Base from './base';
import {
  PROXY_TYPE
} from '../common/constants';
import {
  randomId,
  serializeMessage,
  deserializeMessage
} from '../utils/utils';

const eventType = 'message';

const defaultOptions = {
  origin: '*',
  checkTimeout: 200,
  urlPrefix: 'aelf://aelf.io?params=',
  timeout: 3000
};

export default class PostMessage extends Base {
  constructor(options = defaultOptions) {
    super(PROXY_TYPE.postMessage);
    this.eventHandlers = {};
    this.options = {
      ...defaultOptions,
      ...options
    };
    this.isCheckingInjectedPostMessage = false;
    this.messageInQueue = [];
  }

  sendMessage(request) {
    const reqId = randomId();
    request.id = reqId;
    return new Promise((resolve, reject) => {
      this.send(request);
      this.addEventListener(reqId, resolve, reject, this.options.timeout);
    });
  }

  close() {
    // clean resource
    return true;
  }

  send(data) {
    const message = `${this.options.urlPrefix}${serializeMessage(data)}`;
    if (window.originalPostMessage) {
      window.postMessage(message, this.options.origin);
      return;
    }
    if (this.isCheckingInjectedPostMessage) {
      this.messageInQueue.push(message);
      return;
    }
    this.isCheckingInjectedPostMessage = setInterval(() => {
      if (window.originalPostMessage) {
        window.postMessage(message, this.options.origin);
        this.messageInQueue.forEach(msg => {
          window.postMessage(msg, this.options.origin);
        });
        this.messageInQueue = [];
        clearInterval(this.isCheckingInjectedPostMessage);
        this.isCheckingInjectedPostMessage = false;
      }
    }, this.options.checkoutInterval);
  }

  addEventListener(id, resolve, reject, timeout) {
    this.eventHandlers[id] = event => {
      const message = event.data;
      const result = deserializeMessage(message);
      if (!result) {
        reject('No message returned');
      }
      if (!result.id) {
        reject(`Response ${result} has no id`);
      }
      if (result.id !== id) {
        return;
      }
      if (!this.eventHandlers[id]) {
        reject(`Response with id ${id} don't have correspond handler`);
      }
      window.removeEventListener(eventType, this.eventHandlers[id]);
      delete this.eventHandlers[id];
      resolve(result);
    };
    window.addEventListener(eventType, this.eventHandlers[id]);
    if (timeout && timeout > 0 && !this.isCheckingInjectedPostMessage) {
      setTimeout(() => {
        reject('Time out');
        window.removeEventListener(eventType, this.eventHandlers[id]);
      }, parseInt(timeout, 10));
    }
  }
}
