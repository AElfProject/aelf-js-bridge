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
    library: {
      type: 'module'
    }
  },
  resolve: {
    fallback: {
      stream: 'stream-browserify'
    }
  },
  experiments: {
    outputModule: true
  },
  target: 'web',
  optimization: {
    removeEmptyChunks: true,
    sideEffects: true,
    minimize: true
  }
};

export default merge(baseConfig, browserConfig);
