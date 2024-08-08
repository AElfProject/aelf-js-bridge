# aelf-bridge

English | [中文](./README.zh-CN.md)

<p>
  <a href="https://nodejs.org/download/">
    <img alt="Node version" src="https://img.shields.io/node/v/aelf-bridge.svg">
  </a>
  <img alt="NPM" src="https://img.shields.io/npm/l/aelf-bridge">
  <a href="http://commitizen.github.io/cz-cli/"><img alt="Commitizen friendly" src="https://img.shields.io/badge/commitizen-friendly-brightgreen.svg"></a>
  <!-- <a href="https://github.com/AElfProject/aelf-web-login/actions/workflows/publish.yml">
    <img alt="coverage" src="https://github.com/AElfProject/aelf-web-login/actions/workflows/publish.yml/badge.svg">
  </a> -->
</p>

## Table of Contents
  - [Introduction](#introduction)
  - [Installation](#installation)
    - [Using version management tools](#using-version-management-tools)
    - [Using the script tag](#using-the-script-tag)
  - [Usage](#usage)
    - [Introduction](#introduction)
    - [Initialization](#initialization)
      - [Options](#options)
    - [Get wallet account information](#get-wallet-account-information)
    - [Call contract method (read-only and send transaction)](#call-contract-method-read-only-and-send-transaction)
    - [Calling the chain API](#calling-the-chain-api)
    - [disconnect](#disconnect)

## Introduction

Since dApps are not allowed to store any wallet information, the wallet application stores AElf wallet information and can communicate directly with the AElf chain. In order to protect wallet information and provide dApps with the ability to interact with the chain, aelf-bridge can be used for interacting with the wallet.

The wallet App described here includes a mobile (iOS/Android) native app, desktop app and more.

## Installation

AElf-bridge is part of the AElf ecosystem. Since dApps are mostly web applications, we provide a `JavaScript` SDK available using `Npm` or `yarn` as a version management tool or directly with the script tag.

### Using version management tools

```bash
npm i aelf-bridge
// or
yarn add aelf-bridge
```

### Using the script tag

```html
<script src="https://unpkg.com/aelf-bridge@latest/dist/aelf-bridge.js"></script>
```

## Usage

### Introduction

The communications between a dApp and the chain need to go through some wallet software. This wallet software could be any client that has implemented the AElf bridge protocol. at the time of writing (2020.06), AElf mobile wallet App and `aelf-command` have implemented this protocol.

Since dApps are mostly web applications and web applications can communicate with clients in many ways, this SDK supports two of them:

* postMessage: a dApp will run in a container (`iframe` or mobile Apps' `webview`), and the container needs to overwrite `window.postMessage` method in the dApp, so the dApp and the container can communicate with each other by overwritten `postMessage`. AElf mobile wallet App has implemented this.
* WebSocket(Socket.io): use traditional B/S architecture, communicate by `WebSocket`. SDK uses `Socket.io` to support `WebSocket` communication, and this requires servers need to support `Socket.io` too. `aelf-command` has implemented this way.

Developers can choose one of them depending on requirements, in the process of development, we provide two ways to support data mock and debugging:

* [aelf-bridge-demo](https://github.com/AElfProject/aelf-bridge-demo): this demo uses `iframe` to overwrite `dapp.html`'s `postMessage` to simulate communication with mobile Apps.
* [aelf-command dapp-server](https://github.com/AElfProject/aelf-command): `aelf-command` provides a simple `socket.io` server to support the communication method `socket.io` in `aelf-bridge`, developers can change the communication way to `SOCKET.IO`, and give the URI given by running `aelf-command dapp-server` as an option when initializing `aelf-bridge` instance. Therefore, developers can inspect the communications in the Network tab of browser.

### Initialization

```javascript
import AElfBridge from 'aelf-bridge';

// Initialize the bridge instance, you can pass options during initialization to specify the behavior, see below for explanation
const bridgeInstance = new AElfBridge();
// init with options
const bridgeInstance = new AElfBridge({
  timeout: 5000 // ms
});

// After initializing the instance you need connect
bridgeInstance.connect().then(isConnected => {
  // isConnected True if the connection was successful.
})
```

#### Options

The options can be passed as follows:

```javascript
const defaultOptions = {
  proxyType: String, // The default is `POST_MESSAGE`. Currently, we support the `POST_MESSAGE` and `SOCKET.IO` proxy types are provided. The `Websocket` mechanism will be provided in the future. Valid values ​​are available via `AElfBridge.getProxies()`.
  channelType: String, // The default is `SIGN`, it is the serialization of the request and response, that is, Dapp exchanges the public and private keys with the client and the private key is used to verify the signature information, thereby verifying whether the information has been tampered with. Another method of symmetric encryption is provided. The parameter value is `ENCRYPT`, and the shared public key is used for symmetric encryption. The valid value of the parameter is obtained by `AElfBridge.getChannels()`.
  timeout: Number, // Request timeout, defaults to 3000 milliseconds
  appId: String, // The default is empty. Dapp does not specify if there is no special requirement. If you need to specify it, you need to randomly generate a 32-bit hex-coded id each time. A credential used to communicate with the client, specifying the Dapp ID. If it is not specified, the library will process it internally. The first run will generate a random 32-bit hex-encoded uuid. After the connection is successful, it will be stored in `localStorage`, then the value will be taken from `localStorage`. If not, then Generate a random id.
  endpoint: String, // The default is empty. If the address of the node is empty, the client uses the internally saved primary link address by default, and can also specify to send a request to a specific node.
  // Optional options in `POST_MESSAGE` communication mode
  origin: String, // The default is `*`, the second parameter of the `postMessage` function, in most cases you do not need to specify
  checkoutTimeout: Number, // The default is `200`, in milliseconds, it checks the client's injected `postMessage`. In most cases, you don't need to specify this
  urlPrefix: String, // The default is `aelf://aelf.io?params=`, which is used to specify the protocol and prefix of the node. If the client does not have special requirements, it does not need to be changed.
  // Optional options in `socket.io` communication mode.
  socketUrl: String, // The address of the websocket connection, the default is `http://localhost:50845`
  socketPath: String, // Path to the connection address, the default is empty
  messageType: String // Pass the type of the socket.io message, the default is `bridge`
}
```

### Get wallet account information

`bridgeInstance.account()`

```javascript
bridgeInstance.account().then(res => {
  console.log(res);
})
res = {
  "accounts": [
    {
      "name": "test",
      "address": "XxajQQtYxnsgQp92oiSeENao9XkmqbEitDD8CJKfDctvAQmH6"
    }
   ],
  "chains": [
    {
      "url": "http://13.231.179.27:8000",
      "isMainChain": true,
      "chainId": "AELF"
    },
    {
      "url": "http://52.68.97.242:8000",
      "isMainChain": false,
      "chainId": "2112"
    },
    {
      "url": "http://52.196.227.200:8000",
      "isMainChain": false,
      "chainId": "2113"
    }
  ]
}
```

### Calling the chain API

API for interacting with the node. The API available methods can be viewed by `{chain address}/swagger/index.html`, to get the currently supported APIs you can call `AElfBridge.getChainApis()`.

Developer can use the methods of `bridgeInstance.chain` to call the api.

Example:

* Get block height

```javascript
bridgeInstance.chain.getBlockHeight().then(console.log).catch(console.log)
```

* Get chain status
```javascript
bridgeInstance.chain.getChainStatus().then(console.log).catch(console.log)
```

### Call contract method (read-only and send transaction)

* Get contract method list
* Send transaction
* Contract read-only method

Example:

* Call the `Transfer` method of the `Token` contract to initiate a transfer transaction

```javascript
const tokenAddress = 'mS8xMLs9SuWdNECkrfQPF8SuRXRuQzitpjzghi3en39C3SRvf'; // Get contract address by genesis contract method `GetContractAddressByName`
bridgeInstance.chain.contractAt(tokenAddress).then(async contract => {
    const tokenInfo = await contract.GetTokenInfo.call({symbol: 'ELF'});
    const transactionId = await contract.Transfer({
          amount: "10000000000",
          to: "fasatqawag",
          symbol: "ELF",
          memo: "transfer ELF"
    });
    console.log(tokenInfo);
    console.log(transactionId);
})
```

### disconnect

Used to disconnect from the client and clearing the public key information, etc.

`bridgeInstance.disconnect()`
