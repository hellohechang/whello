const { resolve } = require('path')
const { merge } = require('webpack-merge')
module.exports = merge(require('./webpack.base'), {
  devServer: {
    static: {
      directory: resolve(__dirname, '..', 'src'),
    },
    compress: true,
    port: 9000,
    // open: true,
    hot: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:4000',
        pathRewrite: { '^/api': '' },
      },
    },
  },
  mode: 'development',
  devtool: 'source-map'
})