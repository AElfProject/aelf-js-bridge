/**
 * @file webpack bundle analyze 分析包大小
 * @author yangmutong
 */

/* eslint-env node */

const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');
const {UnusedFilesWebpackPlugin} = require('unused-files-webpack-plugin');
const merge = require('webpack-merge');
const browserConfig = require('./webpack.prod');

const unusedAnalyzeConfig = {
  patterns: ['src/**/*.*'],
  globOptions: {
    ignore: [
      '**/*.md',
      'node_modules/**/*'
    ]
  }
};

module.exports = merge(browserConfig, {
  plugins: [
    new BundleAnalyzerPlugin({analyzerMode: 'static', generateStatsFile: true}),
    new UnusedFilesWebpackPlugin(unusedAnalyzeConfig)
  ]
});
