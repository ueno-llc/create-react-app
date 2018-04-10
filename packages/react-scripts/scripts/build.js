// @remove-on-eject-begin
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// @remove-on-eject-end
'use strict';

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err;
});

// Ensure environment variables are read.
require('../config/env');
// @remove-on-eject-begin
// Do the preflight check (only happens before eject).
const verifyPackageTree = require('./utils/verifyPackageTree');
if (process.env.SKIP_PREFLIGHT_CHECK !== 'true') {
  verifyPackageTree();
}
// @remove-on-eject-end

const chalk = require('chalk');
const fs = require('fs-extra');
const webpack = require('webpack');
const config = require('../config/webpack.config.client.prod');
const serverConfig = require('../config/webpack.config.server.prod');
const paths = require('../config/paths');
const checkRequiredFiles = require('@ueno/react-dev-utils/checkRequiredFiles');
const formatWebpackMessages = require('@ueno/react-dev-utils/formatWebpackMessages');
const FileSizeReporter = require('@ueno/react-dev-utils/FileSizeReporter');
const printBuildError = require('@ueno/react-dev-utils/printBuildError');
const { printBrowsers } = require('@ueno/react-dev-utils/browsersHelper');

const measureFileSizesBeforeBuild =
  FileSizeReporter.measureFileSizesBeforeBuild;
const printFileSizesAfterBuild = FileSizeReporter.printFileSizesAfterBuild;

// These sizes are pretty large. We'll warn for bundles exceeding them.
const WARN_AFTER_BUNDLE_GZIP_SIZE = 512 * 1024;
const WARN_AFTER_CHUNK_GZIP_SIZE = 1024 * 1024;

// Warn and crash if required files are missing
if (!checkRequiredFiles([paths.appIndexJs])) {
  process.exit(1);
}

let isServer = false;

// We require that you explictly set browsers and do not fall back to
// browserslist defaults.
const { checkBrowsers } = require('@ueno/react-dev-utils/browsersHelper');
const compile = webpackConfig =>
  checkBrowsers(paths.appPath)
    .then(() => {
      // First, read the current file sizes in build directory.
      // This lets us display how much they changed later.
      return measureFileSizesBeforeBuild(paths.appBuild);
    })
    .then(previousFileSizes => {
      // Remove all content but keep the directory so that
      // if you're in it, you don't end up in Trash
      if (!isServer) {
        fs.emptyDirSync(paths.appBuild);
      }
      // Merge with the public folder
      copyPublicFolder();
      // Start the webpack build
      return build(webpackConfig, previousFileSizes);
    })
    .then(
      ({ stats, previousFileSizes, warnings }) => {
        if (warnings.length) {
          console.log(chalk.yellow('Compiled with warnings.\n'));
          console.log(warnings.join('\n\n'));
          console.log(
            '\nSearch for the ' +
              chalk.underline(chalk.yellow('keywords')) +
              ' to learn more about each warning.'
          );
          console.log(
            'To ignore, add ' +
              chalk.cyan('// eslint-disable-next-line') +
              ' to the line before.\n'
          );
        } else {
          console.log(
            chalk.green(
              `Compiled ${isServer ? 'server' : 'client'} successfully.\n`
            )
          );
        }

        console.log('File sizes after gzip:\n');
        printFileSizesAfterBuild(
          stats,
          previousFileSizes,
          paths.appBuild,
          WARN_AFTER_BUNDLE_GZIP_SIZE,
          WARN_AFTER_CHUNK_GZIP_SIZE
        );
        console.log();

        if (isServer) {
          // TODO: Print hosting instructions
          console.log();
          console.log('Server can be started with:');
          console.log();
          console.log(chalk.yellow('  node build/server.js'));
          console.log();
        } else {
          console.log();
          printBrowsers(paths.appPath);
        }
        isServer = true;
      },
      err => {
        console.log(chalk.red('Failed to compile.\n'));
        printBuildError(err);
        process.exit(1);
      }
    )
    .catch(err => {
      if (err && err.message) {
        console.log(err.message);
      }
      process.exit(1);
    });

// Create the production build and print the deployment instructions.
function build(webpackConfig, previousFileSizes) {
  console.log(
    `Creating an optimized production ${
      isServer ? 'server' : 'client'
    } build...`
  );

  let compiler = webpack(webpackConfig);
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) {
        return reject(err);
      }
      const messages = formatWebpackMessages(stats.toJson({}, true));
      if (messages.errors.length) {
        // Only keep the first error. Others are often indicative
        // of the same problem, but confuse the reader with noise.
        if (messages.errors.length > 1) {
          messages.errors.length = 1;
        }
        return reject(new Error(messages.errors.join('\n\n')));
      }
      if (
        process.env.CI &&
        (typeof process.env.CI !== 'string' ||
          process.env.CI.toLowerCase() !== 'false') &&
        messages.warnings.length
      ) {
        console.log(
          chalk.yellow(
            '\nTreating warnings as errors because process.env.CI = true.\n' +
              'Most CI servers set it automatically.\n'
          )
        );
        return reject(new Error(messages.warnings.join('\n\n')));
      }
      return resolve({
        stats,
        previousFileSizes,
        warnings: messages.warnings,
      });
    });
  });
}

function copyPublicFolder() {
  fs.copySync(paths.appPublic, paths.appBuild, {
    dereference: true,
    filter: file => file !== paths.appHtml,
  });
}

compile(config)
  .then(() => compile(serverConfig))
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
