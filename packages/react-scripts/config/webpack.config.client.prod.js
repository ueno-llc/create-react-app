'use strict';

const workboxPlugin = require('workbox-webpack-plugin');
const config = require('./webpack.config.prod');
const { applyConfig } = require('./shared');

applyConfig(config);

config.plugins.push(
  new workboxPlugin.GenerateSW({
    swDest: 'sw.js',
    clientsClaim: true,
    skipWaiting: true,
  })
);

module.exports = config;
