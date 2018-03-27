'use strict';

const config = {};
const browser = {};
const defaults = {};

// Only server side
if (typeof window === 'undefined') {
  // Setup dotenv
  require('dotenv').config();
  // Assign env to config
  Object.assign(config, process.env);
  // TODO: Warn when stuff is accessed without any default declerations.
}

// Set defaults
config.setDefaults = function setDefaults(defaultConfig) {
  // Update default config
  Object.assign(defaults, defaultConfig);

  // Update the real config object
  Object.entries(defaultConfig).forEach(([key, value]) => {
    if (typeof config[key] === 'undefined') {
      // Every key is treated as string to maintain persistency
      // between POSIX and JS environment.
      config[key] = String(value);
    }
  });
};

// get browser config
config.getBrowser = function getBrowser() {
  const res = {};

  Object.entries(browser).forEach(([key, value]) => {
    // Make sure the environment already exists
    if (typeof config[key] === 'undefined') {
      return;
    }

    if (value !== false) {
      res[key] = config[key];
    }

    if (typeof value === 'function') {
      res[key] = String(value(res[key]));
    }
  });

  return res;
};

// Rehydration function for the browser
config.rehydrate = function rehydrate(obj) {
  Object.assign(config, obj);
};

module.exports = config;
