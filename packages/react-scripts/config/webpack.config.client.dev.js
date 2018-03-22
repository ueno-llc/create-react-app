'use strict';

const cloneDeep = require('clone-deep');
const config = cloneDeep(require('./webpack.config.dev'));

const { applyConfig } = require('./shared');

applyConfig(config);

module.exports = config;
