# 客户端通信协议

## 通信方式

目前`aelf-bridge`暂时只提供了一种通信机制，即客户端向Dapp所在的WebView复写`postMessage`方法，将原有的`postMessage`保存为`window.originalPostMessage`，覆盖新的`postMessage`方法。客户端具体如何注入复写参见[ONT参考链接](https://github.com/ontio-cyano/cyano-android/blob/master/app/src/main/java/com/github/ont/cyanowallet/ontid/web/CyanoWebView.java)

其他的通信方式有`webSocket`，目前待支持

## 协议标准

### request标准格式

```json
{
  "id": "7e96904c3fcc42c1b4d0582d4b9b3a31", // request id, 用于区分是哪个request，每次请求都产生随机的id，客户端返回时需要携带此id，保证请求与相应一一对应
  "appId": "401a73193a7949f895fde6236f194f77", // app id, 用于区分dapp，随机数生成的32位hex，如果localStorage中有，则获取，如果没有，则不获取, 随机产生32位hex
  "action": "connect", // 请求类型，客户端根据此值做不同的处理
  "params": {} // params为请求的参数
}
```

### response标准格式

```json
{
  "id": "7e96904c3fcc42c1b4d0582d4b9b3a31", // request id, 从request中获取，保证resquest与response一一对应
  "result": {
    "code": 0, // 0为返回正确，其余值表示返回错误
    "msg": "success", // 简单的错误信息
    "error": [], // 如果有错误，则将错误填充到数组中
    "data": {
      "random": "31a0a733be2245f0b270a25762b4ded4",
      "publicKey": "04b7c67eb59703d4483ba94ea99d197aaccb4262a45f7797c0fb67e60d28b63b603d7d6755b6f8da70bff0b348b091195461f872ed0618c505b059c3a55879cce7",
      "signature": "e3740eb8426dffa60026da60d42f53e1f6a84a996a8dd8f3ae73311add9b91657dcfa284be70da444a52c88e3e0bc6350eed7cabc1975d973f964a3fda166c841" // 用私钥对random字段签名的结果
    } // 实际的返回内容
  }
}
```

返回信息需要为此标准，其余标准不会被接受

## 请求接口列表

**现有的action类型，以及详细的Request/Response参数如下**

### connect，与客户端进行初始化连接交换公钥（此处以对数据进行签名的方式进行讲解，加密方式暂不阐释）

用于初始化连接，必须在所有的连接之前发送，用于交换Dapp与客户端的公钥，验证签名。客户端准许Dapp登入，获取appId

#### Request

```json
{
  "id": "7e96904c3fcc42c1b4d0582d4b9b3a31", // request id, 用于区分是哪个request，每次请求都产生随机的id
  "appId": "401a73193a7949f895fde6236f194f77", // app id, 用于区分dapp，随机数生成的32位hex，如果localStorage中有，则获取，如果没有，则不获取, 随机产生32位hex
  "action": "connect",
  "params": {
    "encryptAlgorithm": "secp256k1", // 公私钥生成的椭圆曲线函数算法类型，客户端根据此值生成对应类型的公私钥
    "publickKey": "046814df1b6d6274a6cc8c250d6fae46e06d617116f4fdd63b1b4f564768243aeec6ccbb3247c12f46e2064fb00731938dd2ef821ec9feb1942f7828eae1cc056c", // 可以公开的公钥
    "random": "2b32a8376316403591b5b01ae0013854", // 随机的32位hex id
    "signature": "e3740eb8426dffa60026da60d42f53e1f6a84a996a8dd8f3ae73311add9b91657dcfa284be70da444a52c88e3e0bc6350eed7cabc1975d973f964a3fda166c841" // 使用私钥对random字段签名的结果
  }
}
```

#### Response

```json
{
  "id": "7e96904c3fcc42c1b4d0582d4b9b3a31", // request id, 从request中获取
  "result": {
    "code": 0, // 0为返回正确，其余值表示返回错误
    "msg": "success", // 简单的错误信息
    "error": [], // 如果有错误，则将错误填充到数组中
    "data": {
      "random": "31a0a733be2245f0b270a25762b4ded4", // 客户端生成的随机数，被签名
      "publicKey": "04b7c67eb59703d4483ba94ea99d197aaccb4262a45f7797c0fb67e60d28b63b603d7d6755b6f8da70bff0b348b091195461f872ed0618c505b059c3a55879cce7", // 客户端的公钥
      "signature": "e3740eb8426dffa60026da60d42f53e1f6a84a996a8dd8f3ae73311add9b91657dcfa284be70da444a52c88e3e0bc6350eed7cabc1975d973f964a3fda166c841" // 用私钥对random字段签名的结果
    } // 实际的返回内容
  }
}
```

### account，获取钱包账户信息

#### Request

```json
{
  "id": "7e96904c3fcc42c1b4d0582d4b9b3a31",
  "appId": "401a73193a7949f895fde6236f194f77", // app id, 用于区分dapp，随机数生成的32位hex，如果localStorage中有，则获取，如果没有，则不获取
  "action": "account",
  "params": {}
}
```

#### Response

```json
{
  "id": "7e96904c3fcc42c1b4d0582d4b9b3a31",
  "result": {
    "code": 0, // 0为返回正确，其余值表示返回错误
    "msg": "success", // 简单的错误信息
    "error": [], // 如果有错误，则将错误填充到数组中
    "data": {
      "accountName": "test", // 账户名称
      "address": "adagafadafa", // 钱包地址
      "chains": [
        {
          "url": "http://1.1.1.1:8000", // 链节点地址
          "isMainChain": true, // 是否为主链
          "chainId": "AELF" // 链id
        },
        {
          "url": "http://1.1.1.1:8001",
          "isMainChain": false, // 是否为主链
          "chainId": "2112"
        },
        {
          "url": "http://1.1.1.1:8002",
          "isMainChain": false, // 是否为主链
          "chainId": "2113"
        }
      ] // 钱包端存储的默认的链的信息，分为主侧链
    } // 实际的返回内容
  }
}
```

返回的钱包信息视钱包App情况更改

### invoke/invokeRead 调用合约方法发送交易/只读方法

#### Request

```json
{
  "id": "7e96904c3fcc42c1b4d0582d4b9b3a31",
  "appId": "401a73193a7949f895fde6236f194f77", // app id, 用于区分dapp，随机数生成的32位hex，如果localStorage中有，则获取，如果没有，则不获取
  "action": "invoke", // 调用合约只读方法为`invokeRead`
  "params": {
    "endpoint": "", // 链节点地址，非必填，为空或不传时，钱包App使用自己存储的主链地址
    "contractAddress": "qweqweqeq", // 合约地址
    "contractMethod": "Transfer", // 合约方法名
    "arguments": [
      {
        "name": "transfer",
        "value": {
          "amount": "10000000000",
          "to": "fasatqawag",
          "symbol": "ELF",
          "memo": "transfer ELF"
        }
      }
    ] // 合约方法参数, 是一个数组，可支持0到任意多个参数
  }
}
```

#### Response

```json
{
  "id": "7e96904c3fcc42c1b4d0582d4b9b3a31",
  "result": {
    "code": 0, // 0为返回正确，其余值表示返回错误
    "msg": "success", // 简单的错误信息
    "error": [], // 如果有错误，则将错误填充到数组中
    "data": {
      "TransactionId": "1231321321321321"
    } // 实际的返回内容，直接将对应合约方法的返回作为`data`的值
  }
}
```

#### api-调用链的API

#### Request
```json
{
  "id": "7e96904c3fcc42c1b4d0582d4b9b3a31",
  "appId": "401a73193a7949f895fde6236f194f77", // app id, 用于区分dapp，随机数生成的32位hex，如果localStorage中有，则获取，如果没有，则不获取
  "action": "api", // 调用链的api
  "params": {
    "endpoint": "", // 链节点地址，非必填，为空或不传时使用钱包端存储的主链地址
    "apiPath": "/api/blockChain/blockHeight", // api路径
    "arguments": [] // 传递的参数，实际为`aelf.chain.{method}`方法使用的参数
  }
}
```

#### Response

```json
{
  "id": "7e96904c3fcc42c1b4d0582d4b9b3a31",
  "result": {
    "code": 0, // 0为返回正确，其余值表示返回错误
    "msg": "success", // 简单的错误信息
    "error": [], // 如果有错误，则将错误填充到数组中
    "data": 1000 // 实际的返回内容
  }
}
```

#### 目前支持的API

```javascript
const CHAIN_APIS = [
  '/api/blockChain/chainStatus',
  '/api/blockChain/blockState',
  '/api/blockChain/contractFileDescriptorSet',
  '/api/blockChain/blockHeight',
  '/api/blockChain/block',
  '/api/blockChain/blockByHeight',
  '/api/blockChain/transactionResult',
  '/api/blockChain/transactionResults',
  '/api/blockChain/merklePathByTransactionId'
];
```

### disconnect 与端断开连接，端清除Dapp的相关信息

#### Request

```json
{
  "id": "7e96904c3fcc42c1b4d0582d4b9b3a31",
  "appId": "401a73193a7949f895fde6236f194f77", // app id, 用于区分dapp，随机数生成的32位hex，如果localStorage中有，则获取，如果没有，则不获取
  "action": "disconnect", // 调用合约只读方法为`invokeRead`
  "params": {}
}
```

#### Response

```json
{
  "id": "7e96904c3fcc42c1b4d0582d4b9b3a31",
  "result": {
    "code": 0, // 0为返回正确，其余值表示返回错误
    "msg": "success", // 简单的错误信息
    "error": [], // 如果有错误，则将错误填充到数组中
    "data": {}
  }
}
```

## 原数据加密/签名通道

对上述的数据，为保证数据的安全性，支持对原数据进行签名或者加密，然后将签名后或者加密后的数据发送出去。

目前`aelf-bridge`支持两种原数据加密/签名方式，默认为签名方式，加密方式可用于数据需要严格保密的Dapp

### 签名

#### connect

因未connect之前，公钥未相互交换，所以对connect的request/response不做处理，保持原样

#### 其余类型的API

##### Request

* 处理前
```json
{
  "id": "7e96904c3fcc42c1b4d0582d4b9b3a31",
  "appId": "401a73193a7949f895fde6236f194f77", // app id, 用于区分dapp，随机数生成的32位hex，如果localStorage中有，则获取，如果没有，则不获取
  "action": "invoke", // 调用合约只读方法为`invokeRead`
  "params": {
    "endpoint": "", // 链节点地址，非必填，为空或不传时，钱包App使用自己存储的主链地址
    "contractAddress": "qweqweqeq", // 合约地址
    "contractMethod": "Transfer", // 合约方法名
    "arguments": [
      {
        "name": "transfer",
        "value": {
          "amount": "10000000000",
          "to": "fasatqawag",
          "symbol": "ELF",
          "memo": "transfer ELF"
        }
      }
    ] // 合约方法参数, 是一个数组，可支持0到任意多个参数
  }
}
```

* 处理后
```json
{
  "id": "7e96904c3fcc42c1b4d0582d4b9b3a31",
  "appId": "401a73193a7949f895fde6236f194f77", // app id, 用于区分dapp，随机数生成的32位hex，如果localStorage中有，则获取，如果没有，则不获取
  "action": "invoke",
  "params": {
    /// 使用Dapp自身的私钥，对`originalParams`的签名
    "signature": "e3740eb8426dffa60026da60d42f53e1f6a84a996a8dd8f3ae73311add9b91657dcfa284be70da444a52c88e3e0bc6350eed7cabc1975d973f964a3fda166c841", // 使用私钥对originalParams进行签名
    // 将`params`的value，经过处理后获取的`base64`字符串
    "originalParams": "encoded string with base64"
  }
}
```

处理步骤：
1. 将`params`进行`JSON.stringify`处理，一般需要传递的`params`为JSON对象，需要首先进行JSON序列化，转化为字符串
2. `encodeURIComponent`，对`JSON string`进行特殊字符转义编码
3. `btoa`，将上述产生的字符串，进行`base64`编码
4. 使用Dapp的私钥对`base64`的字符串进行签名，将签名和处理后的数据分别作为`params.signature`和`params.originalParams`。


##### Response

* 处理前
```json
{
  "id": "7e96904c3fcc42c1b4d0582d4b9b3a31",
  "result": {
    "code": 0, // 0为返回正确，其余值表示返回错误
    "msg": "success", // 简单的错误信息
    "error": [], // 如果有错误，则将错误填充到数组中
    "data": {
      "TransactionId": "1231321321321321"
    } // 实际的返回内容，直接将对应合约方法的返回作为`data`的值
  }
}
```

* 处理后
```json
{
  "id": "7e96904c3fcc42c1b4d0582d4b9b3a31",
  "result": {
    "signature": "e3740eb8426dffa60026da60d42f53e1f6a84a996a8dd8f3ae73311add9b91657dcfa284be70da444a52c88e3e0bc6350eed7cabc1975d973f964a3fda166c841", // 使用私钥对originalParams进行签名
    "originalResult": "encoded string with base64"
  }
}
```

处理步骤：
1. 将`result`进行`JSON.stringify`处理，一般需要传递的`result`为JSON对象，需要首先进行JSON序列化，转化为字符串
2. `encodeURIComponent`，对`JSON string`进行特殊字符转义编码
3. `btoa`，将上述产生的字符串，进行`base64`编码
4. 使用端上的私钥对`base64`的字符串进行签名，将签名和处理后的数据分别作为`result.signature`和`result.originalParams`。

通过对数据进行签名处理，能够检测出数据是否被第三方篡改，保证通信可靠

### 加密

与上述签名类型，端与Dapp各自有自己的公私钥，椭圆曲线函数一般为`curve25519`，能够通过交换公钥，然后公私钥对在第三方公钥的基础上，产生一个共享公钥。`curve25519`能够保证两方根据公钥产生的共享公钥是一直的，从而可以使用这个公钥作为对称加密的`passpharse`。

#### connect

因未connect之前，公钥未相互交换，所以对connect的request/response不做处理，保持原样。加密的`connect`的数据格式有所不一致

##### Request

```json
{
  "id": "7e96904c3fcc42c1b4d0582d4b9b3a31", // request id, 用于区分是哪个request，每次请求都产生随机的id
  "appId": "401a73193a7949f895fde6236f194f77", // app id, 用于区分dapp，随机数生成的32位hex，如果localStorage中有，则获取，如果没有，则不获取, 随机产生32位hex
  "action": "connect",
  "params": {
    "encryptAlgorithm": "curve25519", // 公私钥生成的椭圆曲线函数算法类型，客户端根据此值生成对应类型的公私钥
    "publickKey": "046814df1b6d6274a6cc8c250d6fae46e06d617116f4fdd63b1b4f564768243aeec6ccbb3247c12f46e2064fb00731938dd2ef821ec9feb1942f7828eae1cc056c", // 可以公开的公钥
    "cipher": "aes-256-cbc" // 对称加密使用的算法
  }
}
```

##### Response

```json
{
  "id": "7e96904c3fcc42c1b4d0582d4b9b3a31", // request id, 从request中获取
  "result": {
    "code": 0, // 0为返回正确，其余值表示返回错误
    "msg": "success", // 简单的错误信息
    "error": [], // 如果有错误，则将错误填充到数组中
    "data": {
      "publicKey": "04b7c67eb59703d4483ba94ea99d197aaccb4262a45f7797c0fb67e60d28b63b603d7d6755b6f8da70bff0b348b091195461f872ed0618c505b059c3a55879cce7" // 客户端的公钥
    } // 实际的返回内容
  }
}
```

通过直接交换公钥，两端生成一致的共享公钥

#### 其余类型的API

##### Request

* 处理前
```json
{
  "id": "7e96904c3fcc42c1b4d0582d4b9b3a31",
  "appId": "401a73193a7949f895fde6236f194f77", // app id, 用于区分dapp，随机数生成的32位hex，如果localStorage中有，则获取，如果没有，则不获取
  "action": "invoke", // 调用合约只读方法为`invokeRead`
  "params": {
    "endpoint": "", // 链节点地址，非必填，为空或不传时，钱包App使用自己存储的主链地址
    "contractAddress": "qweqweqeq", // 合约地址
    "contractMethod": "Transfer", // 合约方法名
    "arguments": [
      {
        "name": "transfer",
        "value": {
          "amount": "10000000000",
          "to": "fasatqawag",
          "symbol": "ELF",
          "memo": "transfer ELF"
        }
      }
    ] // 合约方法参数, 是一个数组，可支持0到任意多个参数
  }
}
```

* 处理后
```json
{
  "id": "7e96904c3fcc42c1b4d0582d4b9b3a31",
  "appId": "401a73193a7949f895fde6236f194f77", // app id, 用于区分dapp，随机数生成的32位hex，如果localStorage中有，则获取，如果没有，则不获取
  "action": "invoke",
  "params": {
    /// 使用共享公钥，对`params`进行处理后，对称加密，`iv`是AES加密使用的初始化向量，此处为32位的hex，随机产生
    "iv": "401a73193a7949f895fde6236f194f77",
    // 将`params`的value，经过处理后获取的`base64`字符串
    "encryptedParams": "encoded string with base64"
  }
}
```

处理步骤：
1. 将`params`进行`JSON.stringify`处理，一般需要传递的`params`为JSON对象，需要首先进行JSON序列化，转化为字符串
2. `encodeURIComponent`，对`JSON string`进行特殊字符转义编码
3. `btoa`，将上述产生的字符串，进行`base64`编码
4. 使用共享公钥，对上述数据进行`AES`对称加密，`iv`是AES加密使用的初始化向量，此处为随机产生的32位的hex，然后将`iv`作为`params.iv`，加密结果作为`params.encryptedParams`。


##### Response

* 处理前
```json
{
  "id": "7e96904c3fcc42c1b4d0582d4b9b3a31",
  "result": {
    "code": 0, // 0为返回正确，其余值表示返回错误
    "msg": "success", // 简单的错误信息
    "error": [], // 如果有错误，则将错误填充到数组中
    "data": {
      "TransactionId": "1231321321321321"
    } // 实际的返回内容，直接将对应合约方法的返回作为`data`的值
  }
}
```

* 处理后
```json
{
  "id": "7e96904c3fcc42c1b4d0582d4b9b3a31",
  "result": {
    "iv": "7e96904c3fcc42c1b4d0582d4b9b3a31", // 使用共享公钥加密的初始向量
    "encryptedResult": "encoded string with base64" // 使用共享公钥加密的结果
  }
}
```

处理步骤：
1. 将`result`进行`JSON.stringify`处理，一般需要传递的`result`为JSON对象，需要首先进行JSON序列化，转化为字符串
2. `encodeURIComponent`，对`JSON string`进行特殊字符转义编码
3. `btoa`，将上述产生的字符串，进行`base64`编码
4. 使用共享公钥，对上述数据进行`AES`对称加密，`iv`是AES加密使用的初始化向量，此处为随机产生的32位的hex，然后将`iv`作为`result.iv`，加密结果作为`result.encryptedResult`。

通过对数据进行加密处理，能够放置第三方获取数据的真实情况。

## 通信序列化方式

对上述的通信数据需要进行序列化操作，然后才能够发送信息

### postMessage

Dapp与客户端相互的信息交换可理解为请求与响应。

#### 请求的序列化

`aelf-bridge`将请求经过几层处理：
1. `JSON.stringify`，一般需要传递的信息为JSON对象，需要首先进行JSON序列化，转化为字符串
2. `encodeURIComponent`，需要对特殊字符进行转义编码
3. `btoa`，将上述产生的字符串，进行`base64`编码
4. 拼接url prefix，将上述产生的字符串，拼接在`aelf://aelf.io?params=`前缀后面，前缀在客户端用于区分发送源。前缀在library中通过选项指定更改，需要客户端支持

客户端经过与之相反的步骤，将请求信息反序列化，得到原始的信息

* 处理前
```json
{
  "id": "7e96904c3fcc42c1b4d0582d4b9b3a31",
  "appId": "401a73193a7949f895fde6236f194f77", // app id, 用于区分dapp，随机数生成的32位hex，如果localStorage中有，则获取，如果没有，则不获取
  "action": "invoke",
  "params": {
    /// 使用Dapp自身的私钥，对`originalParams`的签名
    "signature": "e3740eb8426dffa60026da60d42f53e1f6a84a996a8dd8f3ae73311add9b91657dcfa284be70da444a52c88e3e0bc6350eed7cabc1975d973f964a3fda166c841", // 使用私钥对originalParams进行签名
    // 将`params`的value，经过处理后获取的`base64`字符串
    "originalParams": "encoded string with base64"
  }
}
```

* 处理后
```
aelf://aelf.io?params=JTdCJTIyY......mU0OGMlMjIlN0Q=
```

#### 响应的序列化
步骤与请求的序列化步骤相同，去掉第四步，不需要拼接前缀

* 处理前
```json
{
  "id": "7e96904c3fcc42c1b4d0582d4b9b3a31",
  "result": {
    "signature": "e3740eb8426dffa60026da60d42f53e1f6a84a996a8dd8f3ae73311add9b91657dcfa284be70da444a52c88e3e0bc6350eed7cabc1975d973f964a3fda166c841",
    "originalResult": "encoded string with base64"
  }
}
```

* 处理后
```
JTdCJTIyaWQlM......3VsdCUyMiUzQSU3QiUyMI4NGE1JTIyJTdEJTdEJTdE
```
