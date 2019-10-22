/**
 * @file constants
 * @author atom-yang
 */
export const PROXY_TYPE = {
  postMessage: 'POST_MESSAGE',
  webSocket: 'WEB_SOCKET',
  socketIo: 'SOCKET.IO'
};

export const CHANNEL_TYPE = {
  sign: 'SIGN',
  encrypt: 'ENCRYPT'
};

export const CHAIN_APIS = {
  '/api/blockChain/chainStatus': 'getChainStatus',
  '/api/blockChain/blockState': 'getChainState',
  '/api/blockChain/contractFileDescriptorSet': 'getContractFileDescriptorSet',
  '/api/blockChain/blockHeight': 'getBlockHeight',
  '/api/blockChain/block': 'getBlock',
  '/api/blockChain/blockByHeight': 'getBlockByHeight',
  '/api/blockChain/transactionResult': 'getTxResult',
  '/api/blockChain/transactionResults': 'getTxResults',
  '/api/blockChain/merklePathByTransactionId': 'getMerklePathByTxId'
};
