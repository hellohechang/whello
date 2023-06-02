const { resolve } = require('path')
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const autoprefixer = require('autoprefixer')
const { merge } = require('webpack-merge')

module.exports = merge(require('./webpack.base'), {
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", 'postcss-loader'],
      },
      {
        test: /\.less$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'less-loader',
        ],
      },
    ]
  },
  plugins: [
    // css前缀
    autoprefixer,
    // 抽取css
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash:8].css',
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: resolve(__dirname, '..', 'src/img'),
          to: resolve(__dirname, '..', 'static/img')
        }
      ],
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: resolve(__dirname, '..', 'src/css'),
          to: resolve(__dirname, '..', 'static/css')
        }
      ],
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: resolve(__dirname, '..', 'src/favicon.ico'),
          to: resolve(__dirname, '..', 'static')
        }
      ],
    }),
  ],
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