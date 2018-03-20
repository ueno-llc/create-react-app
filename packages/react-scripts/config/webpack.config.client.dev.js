'use strict';

const config = require('./webpack.config.dev');
const { applyConfig } = require('./shared');

applyConfig(config);

const webpackHotClientIndex = config.entry.findIndex(
  item => item === require.resolve('react-dev-utils/webpackHotDevClient')
);
if (webpackHotClientIndex > 0) {
  config.entry.splice(webpackHotClientIndex, 1);
  config.entry.splice(
    webpackHotClientIndex,
    0,
    require.resolve('../lib/webpackHotDevClient')
  );
}

module.exports = config;
