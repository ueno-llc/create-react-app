'use strict';

const config = require('./webpack.config.prod');
const { applyConfig } = require('./shared');

applyConfig(config);

module.exports = config;
