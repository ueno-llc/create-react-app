'use strict';

const config = require('./webpack.config.dev');
const { applyConfig } = require('./shared');

applyConfig(config);

module.exports = config;
