'use strict';

function Config() {
  const proto = Object.getPrototypeOf(this);
  const browser = {};
  const defaults = {};
  const variableName = '__uenoConfig';

  // Only server side
  if (typeof window === 'undefined') {
    // Setup dotenv
    require('dotenv').config();
  } else if (typeof window[variableName] === 'object') {
    // Update real config object
    Object.assign(this, window[variableName]);
  }

  proto.setDefaults = function setDefaults(defaultConfig) {
    // Update default config
    Object.assign(defaults, defaultConfig);

    // Update the real config object
    Object.entries(defaultConfig).forEach(([key, value]) => {
      if (typeof this[key] !== 'undefined') {
        return;
      }

      if (typeof process.env[key] !== 'undefined') {
        this[key] = process.env[key];
      } else {
        // Every key is treated as string to maintain persistency
        // between POSIX and JS environment.
        this[key] = String(value);
      }
    });
  };

  proto.setBrowser = function setBrowser(browserConfig) {
    Object.assign(browser, browserConfig);
  };

  // get browser config
  proto.getBrowser = function getBrowser() {
    const res = {};

    Object.entries(browser).forEach(([key, value]) => {
      // Make sure the environment already exists
      if (typeof this[key] === 'undefined') {
        return;
      }

      if (value !== false) {
        res[key] = String(this[key]);
      }

      if (typeof value === 'function') {
        res[key] = String(value(res[key]));
      }
    });

    return res;
  };
}

module.exports = new Config();
