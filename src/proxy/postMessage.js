/**
 * @file connection with postMessage
 * @author atom-yang
 */
import Base from './base.js';
import { PROXY_TYPE } from '../common/constants.js';
import { randomId, serializeMessage, deserializeMessage } from '../utils/utils.js';
import { window } from '../utils/storage.js';


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
    let timer = null;
    this.eventHandlers[id] = event => {
      const message = event.data;
      const result = deserializeMessage(message);
      if (result && result.id && result.id === id) {
        if (!this.eventHandlers[id]) {
          reject(`Response with id ${id} don't have correspond handler`);
        }
        window.removeEventListener(eventType, this.eventHandlers[id]);
        delete this.eventHandlers[id];
        resolve(result);
        if (timer) {
          clearTimeout(timer);
        }
      }
    };
    window.addEventListener(eventType, this.eventHandlers[id]);
    if (timeout && timeout > 0 && !this.isCheckingInjectedPostMessage) {
      timer = setTimeout(
        () => {
          reject('Time out');
          window.removeEventListener(eventType, this.eventHandlers[id]);
          delete this.eventHandlers[id];
        },
        parseInt(timeout, 10)
      );
    }
  }
}
