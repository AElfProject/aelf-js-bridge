/**
 * @file chain methods
 * @author atom-yang
 */
import { CHAIN_METHODS } from '../common/constants.js';
import ChainMethod from './method.js';

export default class Chain {
  constructor(instance) {
    for (const method of CHAIN_METHODS) {
      const chainMethod = new ChainMethod({
        ...method,
        request: instance
      });
      this[chainMethod.methodName] = chainMethod.run;
    }
  }
}
