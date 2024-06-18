/**
 * @file constants
 * @author atom-yang
 */
export const PROXY_TYPE = {
  postMessage: 'POST_MESSAGE',
  socketIo: 'SOCKET.IO'
};

export const CHANNEL_TYPE = {
  sign: 'SIGN',
  encrypt: 'ENCRYPT'
};

export const CHAIN_METHODS = [
  {
    methodName: 'getChainStatus',
    api: '/api/blockChain/chainStatus',
    params: []
  },
  {
    methodName: 'getChainState',
    api: '/api/blockChain/blockState',
    params: ['blockHash']
  },
  {
    methodName: 'getContractFileDescriptorSet',
    api: '/api/blockChain/contractFileDescriptorSet',
    params: ['address']
  },
  {
    methodName: 'getBlockHeight',
    api: '/api/blockChain/blockHeight',
    params: []
  },
  {
    methodName: 'getBlock',
    api: '/api/blockChain/block',
    params: ['blockHash', 'includeTransactions']
  },
  {
    methodName: 'getBlockByHeight',
    api: '/api/blockChain/blockByHeight',
    params: ['blockHeight', 'includeTransactions']
  },
  {
    methodName: 'getTxResult',
    api: '/api/blockChain/transactionResult',
    params: ['transactionId']
  },
  {
    methodName: 'getTxResults',
    api: '/api/blockChain/transactionResults',
    params: ['blockHash', 'offset', 'limit']
  },
  {
    methodName: 'getMerklePathByTxId',
    api: '/api/blockChain/merklePathByTransactionId',
    params: ['transactionId']
  }
];

export const CHAIN_APIS = CHAIN_METHODS.map(v => v.api);
