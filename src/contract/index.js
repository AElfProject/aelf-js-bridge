/**
 * @file contract
 * @author atom-yang
 */
import ContractMethod from './method.js';
import Contract from './contract.js';

export default class ContractFactory {
  constructor(contractAddress, methodList, instance) {
    this.contractAddress = contractAddress;
    this.methodList = methodList;
    this.instance = instance;
  }

  at() {
    const contractInstance = new Contract(this.contractAddress);
    this.methodList.forEach(method => {
      const contractMethod = new ContractMethod(this.instance, method, this.contractAddress);
      contractMethod.bindMethod(contractInstance);
    });
    return contractInstance;
  }
}
