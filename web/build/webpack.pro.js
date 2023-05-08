const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const { merge } = require('webpack-merge')

module.exports = merge(require('./webpack.base'), {
  performance: { hints: false },
  optimization: {
    minimizer: [
      // 压缩css
      new CssMinimizerPlugin(),
      // 压缩js
      new UglifyJsPlugin({
        test: /\.js(\?.*)?$/i,
      }),
    ]
  },
  mode: 'production',
})