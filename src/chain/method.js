/**
 * @file chain method
 * @author atom-yang
 */

export default class ChainMethod {
  constructor(
    {
      methodName,
      api,
      params = [],
      request
    }
  ) {
    this.methodName = methodName;
    this.api = api;
    this.params = params;
    this.request = request;
    this.run = this.run.bind(this);
  }

  run(...args) {
    const params = {
      apiPath: this.api,
      methodName: this.methodName,
      arguments: args.map((v, i) => ({
        name: this.params[i],
        value: v
      }))
    };
    return this.request.api(params);
  }
}
