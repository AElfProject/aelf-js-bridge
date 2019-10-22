/**
 * @file browser config
 * @author atom-yang
 */

/* eslint-env node */
const merge = require('webpack-merge');
const baseConfig = require('./webpack.common');
const {OUTPUT_PATH} = require('./utils');

const browserConfig = {
  mode: 'production',
  output: {
    path: OUTPUT_PATH,
    filename: 'aelf-bridge.js',
    library: 'AElfBridge',
    libraryTarget: 'umd',
    libraryExport: 'default',
    umdNamedDefine: true
  },
  resolve: {
    alias: {}
  },
  node: {
    stream: true
  },
  target: 'web',
  optimization: {
    removeEmptyChunks: true,
    occurrenceOrder: true,
    sideEffects: true,
    minimize: true
  }
};


module.exports = merge(baseConfig, browserConfig);
