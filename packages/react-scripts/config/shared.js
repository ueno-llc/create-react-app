'use strict';

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InterpolateHtmlPlugin = require('@ueno/react-dev-utils/InterpolateHtmlPlugin');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');

function applyConfig(config) {
  // Find oneOf array
  const oneOf = config.module.rules.find(rule => rule.oneOf).oneOf;

  // Remove CSS loader
  const cssRuleIndex = oneOf.findIndex(
    rule =>
      rule.exclude &&
      rule.exclude instanceof RegExp &&
      rule.exclude.test('.module.css')
  );
  if (cssRuleIndex > 0) {
    oneOf.splice(cssRuleIndex, 1);
  }

  // Work with CSS module loader
  const cssModuleRule = oneOf.find(
    rule =>
      rule.test && rule.test instanceof RegExp && rule.test.test('.module.css')
  );

  if (cssModuleRule) {
    // Update test regular expression to match all css and scss files
    cssModuleRule.test = /(\.scss|\.sass|\.css)$/;
    // Find css-loader
    const cssLoader = cssModuleRule.use.find(
      rule => rule.loader && rule.loader === require.resolve('css-loader')
    );
    if (cssLoader) {
      // Change Local Ident Name
      cssLoader.options.localIdentName = '[name]_[local]_[hash:base64:5]';
    }

    // Add Sass Loader
    cssModuleRule.use.push({
      loader: require.resolve('sass-loader'),
      options: {
        outputStyle: 'expanded',
      },
    });

    // Add Classnames loader
    cssModuleRule.use.splice(0, 0, require.resolve('classnames-loader'));
  }

  // Work with JS module loader
  const jsModuleRule = oneOf.find(
    rule => rule.test && rule.test instanceof RegExp && rule.test.test('.js')
  );
  if (jsModuleRule) {
    const babelLoader = jsModuleRule.use.find(
      n => n && n.loader && n.loader === require.resolve('babel-loader')
    );
    babelLoader.options.presets.push(require.resolve('babel-preset-stage-0'));
    babelLoader.options.plugins.push(
      require.resolve('babel-plugin-transform-decorators-legacy'),
      [
        require.resolve('babel-plugin-transform-class-properties'),
        { loose: true },
      ]
    );
  }

  // Add SVG Loader
  oneOf.splice(0, 0, {
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

  // List of plugins to remove
  const removePlugins = [
    HtmlWebpackPlugin,
    InterpolateHtmlPlugin,
    webpack.DefinePlugin,
    SWPrecacheWebpackPlugin,
  ];

  // Go ahead and replace plugins list
  config.plugins = config.plugins.filter(
    plugin => !removePlugins.find(p => plugin instanceof p)
  );

  config.plugins.push(
    new webpack.DefinePlugin({
      WEBPACK_MODE: `"${process.env.NODE_ENV}"`,
    })
  );

  return config;
}

module.exports = {
  applyConfig,
};
