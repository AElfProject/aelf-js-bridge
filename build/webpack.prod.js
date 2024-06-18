/**
 * @file browser config
 * @author atom-yang
 */

/* eslint-env node */
import { merge } from 'webpack-merge';
import baseConfig from './webpack.common.js';
import { OUTPUT_PATH } from './utils.js';

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
    fallback: {
      stream: 'stream-browserify'
    }
  },
  target: 'web',
  optimization: {
    removeEmptyChunks: true,
    sideEffects: true,
    minimize: true
  }
};

export default merge(baseConfig, browserConfig);
