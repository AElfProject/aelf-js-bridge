/**
 * @file chain methods
 * @author atom-yang
 */
import {
  CHAIN_METHODS
} from '../common/constants';
import ChainMethod from './method';

export default class Chain {
  constructor(instance) {
    // eslint-disable-next-line no-restricted-syntax
    for (const method of CHAIN_METHODS) {
      const chainMethod = new ChainMethod({
        ...method,
        request: instance
      });
      this[chainMethod.methodName] = chainMethod.run;
    }
  }
}
