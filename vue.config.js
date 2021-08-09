/* eslint-disable */
const path = require('path');

module.exports = {
  outputDir: path.resolve(__dirname, './build'),
  devServer: {
    proxy: {
      '/octo-spy': {
        target: 'http://localhost:8080',
        ws: true,
        changeOrigin: true,
      },
    },
  },

  chainWebpack: config => {
    const cssRule = config.module.rule('css')

    // clear all existing loaders.
    // if you don't do this, the loader below will be appended to
    // existing loaders of the rule.
    cssRule.uses.clear()

    // add replacement loader(s)
    cssRule
      .use('sass-loader')
      .loader('sass-loader')
      .tap(options => {
        // modify the options...
        return options
      })
  },

  css: {
    sourceMap: true
  }
};
