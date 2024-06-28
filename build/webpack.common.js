/**
 * @file common config
 * @author atom-yang
 */

/* eslint-env node */
import path from 'path';
import webpack from 'webpack';
import fs from 'fs';
import { ROOT } from './utils.js';

const packageJsonPath = path.resolve(ROOT, './package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

const { version, name } = packageJson;

const banner = `${name}.js v${version} \n(c) 2019-${new Date().getFullYear()} AElf \nReleased under MIT License`;

const baseConfig = {
  entry: path.resolve(ROOT, 'src/index.js'),
  devtool: 'source-map',
  resolve: {
    modules: [path.resolve(ROOT, 'src'), path.resolve(ROOT, 'node_modules')],
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
    ],
  },
  plugins: [new webpack.BannerPlugin(banner)],
};
export default baseConfig;
