'use strict';

process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

const nodeExternals = require('webpack-node-externals');
const ManifestPlugin = require('webpack-manifest-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const paths = require('./paths');
const { applyConfig } = require('./shared');

const config = applyConfig(require('./webpack.config.dev'));
const oneOf = config.module.rules.find(rule => rule.oneOf).oneOf;

// Set output object
config.output = {
  path: paths.appBuild,
  filename: 'server.js',
  publicPath: '/',
};

// Set entry array
config.entry = [path.join(paths.appSrc, 'server', 'index.js')];

// Remove eslint Pre rule
const preIndex = config.module.rules.findIndex(rule => rule.enforce === 'pre');
if (preIndex > 0) {
  config.module.rules.splice(preIndex, 1);
}

// MiniCssExtractPlugin
// ====================
const cssModuleRule = oneOf.find(
  rule => rule.test && rule.test instanceof RegExp && rule.test.test('.css')
);
if (cssModuleRule) {
  cssModuleRule.use.splice(1, 0, MiniCssExtractPlugin.loader);
  const styleLoaderIndex = cssModuleRule.use.findIndex(
    loader => loader === require.resolve('style-loader')
  );
  if (styleLoaderIndex > 0) {
    cssModuleRule.use.splice(styleLoaderIndex, 1);
  }
}
config.plugins.push(
  new MiniCssExtractPlugin({
    filename: 'static/js/[name].[chunkhash:8].css',
    chunkFilename: 'static/js/[name].[chunkhash:8].chunk.css',
  }),
  new ManifestPlugin({
    fileName: 'asset-manifest.json',
  })
);

// Delete node object
delete config.node;

// Remove optimization
delete config.optimization;

// Set target to node
config.target = 'node';

// Set devtool
config.devtool = 'cheap-module-source-map';

// Set minimal stats
config.stats = 'minimal';

// Set watchOptions to allow client bundle to compile first
config.watchOptions = {
  aggregateTimeout: 2000,
};

// Set node externals
config.externals = [nodeExternals()];

module.exports = config;
