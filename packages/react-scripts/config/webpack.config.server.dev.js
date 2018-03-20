'use strict';

process.env.NODE_ENV = 'development';

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const config = require('./webpack.config.dev');
const paths = require('./paths');

// Set output object
config.output = {
  path: paths.appBuild,
  filename: 'server.js',
  publicPath: '/',
};

// Set entry array
config.entry = [path.join(paths.appSrc, 'server', 'index.js')];

// Find and remove pre eslint rule
const preRuleIndex = config.module.rules.findIndex(
  rule => rule.enforce === 'pre'
);
if (preRuleIndex > 0) {
  config.module.rules.splice(preRuleIndex, 1);
}

const oneOf = config.module.rules.find(rule => rule.oneOf);

// Remove CSS loader
const cssRuleIndex = oneOf.findIndex(
  rule => rule.exclude && rule.exclude.test('.module.css')
);
if (cssRuleIndex > 0) {
  oneOf.splice(cssRuleIndex, 1);
}

// Work with CSS module loader
const cssModuleRule = oneOf.find(
  rule => rule.include && rule.include.test('.css')
);
if (cssModuleRule) {
  // Update test regular expression to match all css and scss files
  cssModuleRule.test = /(\.scss|\.sass|\.css)$/;

  // Add MiniExtractText Plugin
  cssModuleRule.use.splice(0, 0, MiniCssExtractPlugin.loader);

  // Find css-loader
  const cssLoader = cssModuleRule.use.find(
    rule => rule.loader && rule.loader === require.resolve('css-loader')
  );

  if (cssLoader) {
    // Change Local Ident Name
    cssLoader.localIdentName = '[name]_[local]_[hash:base64:5]';
  }

  // Add Sass Loader
  cssModuleRule.use.push({
    loader: require.resolve('sass-loader'),
    options: {
      outputStyle: 'expanded',
    },
  });
}

// Add SVG Loader
oneOf.push({
  test: /\.jsx.svg$/,
  use: [
    {
      loader: require.resolve('babel-loader'),
      options: {
        babelrc: false,
        presets: [require.resolve('babel-preset-react-app')],
      },
    },
    require.resolve('svg-to-jsx-loader'),
  ],
});

// Delete node object
delete config.node;

// Set target to node
config.target = 'node';

// Set devtool
config.devtool = 'cheap-module-source-map';

// Get my config
console.log(config);
