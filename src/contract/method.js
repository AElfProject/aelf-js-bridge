/**
 * @file contract method
 * @author atom-yang
 */
export default class ContractMethod {
  constructor(instance, method, contractAddress) {
    this.instance = instance;
    this.method = method;
    this.contractAddress = contractAddress;
    this.send = this.send.bind(this);
    this.call = this.call.bind(this);
  }

  call(...params) {
    return this.instance.invokeRead({
      contractAddress: this.contractAddress,
      contractMethod: this.method,
      arguments: params.map(p => ({
        name: 'params',
        value: p
      }))
    });
  }

  send(...params) {
    return this.instance.invoke({
      contractAddress: this.contractAddress,
      contractMethod: this.method,
      arguments: params.map(p => ({
        name: 'params',
        value: p
      }))
    });
  }

  bindMethod(contract) {
    const { send } = this;
    send.call = this.call;
    send.send = this.send;
    // eslint-disable-next-line no-param-reassign
    contract[this.method] = send;
  }
}
