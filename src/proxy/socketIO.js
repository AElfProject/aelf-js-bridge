/**
 * @file socket.io for proxy
 * @author atom-yang
 */
import io from 'socket.io-client';
import Base from './base';
import {
  PROXY_TYPE
} from '../common/constants';
import {
  randomId
} from '../utils/utils';

const defaultOptions = {
  socketUrl: 'http://localhost:50845',
  socketPath: '',
  messageType: 'bridge'
};

export default class SocketIO extends Base {
  constructor(options = defaultOptions) {
    super(PROXY_TYPE.socketIo);
    this.options = {
      ...defaultOptions,
      ...options
    };
    this.handlers = {};
    this.initSocket();
  }

  initSocket() {
    this.socket = io(this.options.socketUrl, {
      path: this.options.socketPath,
      transports: ['websocket']
    });

    this.socket.on('connection', data => {
      if (data !== 'success') {
        throw new Error('can\'t connect to socket');
      }
    });

    this.socket.on(this.options.messageType, data => {
      const { id } = data;
      if (!this.handlers[id]) {
        throw new Error(`Response with id ${id} don't have correspond handler`);
      }
      this.handlers[id](data);
    });
  }

  close() {
    // clean connection
    return this.socket && this.socket.close();
  }

  sendMessage(request) {
    if (!this.socket.connected) {
      this.socket.open();
    }
    const reqId = randomId();
    request.id = reqId;
    return new Promise((resolve, reject) => {
      this.addHandler(reqId, resolve, reject);
      this.socket.emit(this.options.messageType, request);
    });
  }

  addHandler(id, resolve, reject) {
    this.handlers[id] = data => {
      const { id: responseId } = data;
      if (!responseId) {
        reject(`Response ${data} has no id`);
      }
      delete this.handlers[id];
      resolve(data);
    };
  }
}
