const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const autoprefixer = require('autoprefixer')
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = {
  entry: {
    main: './src/js/main.js',
    login: './src/page/login/login.js',
    allnote: './src/page/allnote/allnote.js',
    edit: './src/page/edit/edit.js',
    bomb: './src/page/bomb/bomb.js',
    history: './src/page/history/history.js',
    color: './src/page/color/color.js',
    note: './src/page/note/note.js',
    notes: './src/page/notes/notes.js',
    pic: './src/page/pic/pic.js',
    recycle: './src/page/recycle/recycle.js',
    root: './src/page/root/root.js',
    sharebm: './src/page/sharebm/sharebm.js',
    sharelist: './src/page/sharelist/sharelist.js',
    sharemusic: './src/page/sharemusic/sharemusic.js',
    suduku: './src/page/suduku/js/sudo.js',
  },
  output: {
    filename: 'js/[name][hash].js',
    path: resolve(__dirname, 'static'),
    clean: true,
  },
  plugins: [
    // css前缀
    autoprefixer,
    // 抽取css
    new MiniCssExtractPlugin({
      filename: '[name][hash].css',
    }),
    new HtmlWebpackPlugin({
      template: './src/page/login/index.html',
      filename: 'page/login/index.html',
      chunks: ['login'],
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true
      }
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      chunks: ['main'],
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true
      }
    }),
    new HtmlWebpackPlugin({
      template: './src/page/allnote/index.html',
      filename: 'page/allnote/index.html',
      chunks: ['allnote'],
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true
      }
    }),
    new HtmlWebpackPlugin({
      template: './src/page/aria2/index.html',
      filename: 'page/aria2/index.html',
      chunks: [],
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true
      }
    }),
    new HtmlWebpackPlugin({
      template: './src/page/bomb/index.html',
      filename: 'page/bomb/index.html',
      chunks: ['bomb'],
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true
      }
    }),
    new HtmlWebpackPlugin({
      template: './src/page/getpd/index.html',
      filename: 'page/getpd/index.html',
      chunks: [],
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true
      }
    }),
    new HtmlWebpackPlugin({
      template: './src/page/edit/index.html',
      filename: 'page/edit/index.html',
      chunks: ['edit'],
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true
      }
    }),
    new HtmlWebpackPlugin({
      template: './src/page/history/index.html',
      filename: 'page/history/index.html',
      chunks: ['history'],
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true
      }
    }),
    new HtmlWebpackPlugin({
      template: './src/page/note/index.html',
      filename: 'page/note/index.html',
      chunks: ['note'],
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true
      }
    }),
    new HtmlWebpackPlugin({
      template: './src/page/notes/index.html',
      filename: 'page/notes/index.html',
      chunks: ['notes'],
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true
      }
    }),
    new HtmlWebpackPlugin({
      template: './src/page/pic/index.html',
      filename: 'page/pic/index.html',
      chunks: ['pic'],
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true
      }
    }),
    new HtmlWebpackPlugin({
      template: './src/page/color/index.html',
      filename: 'page/color/index.html',
      chunks: ['color'],
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true
      }
    }),
    new HtmlWebpackPlugin({
      template: './src/page/recycle/index.html',
      filename: 'page/recycle/index.html',
      chunks: ['recycle'],
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true
      }
    }),
    new HtmlWebpackPlugin({
      template: './src/page/root/index.html',
      filename: 'page/root/index.html',
      chunks: ['root'],
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true
      }
    }),
    new HtmlWebpackPlugin({
      template: './src/page/sharebm/index.html',
      filename: 'page/sharebm/index.html',
      chunks: ['sharebm'],
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true
      }
    }),
    new HtmlWebpackPlugin({
      template: './src/page/sharemusic/index.html',
      filename: 'page/sharemusic/index.html',
      chunks: ['sharemusic'],
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true
      }
    }),
    new HtmlWebpackPlugin({
      template: './src/page/sharelist/index.html',
      filename: 'page/sharelist/index.html',
      chunks: ['sharelist'],
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true
      }
    }),
    new HtmlWebpackPlugin({
      template: './src/page/suduku/index.html',
      filename: 'page/suduku/index.html',
      chunks: ['suduku'],
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true
      }
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: resolve(__dirname, 'src/img'),
          to: resolve(__dirname, 'static/img')
        }
      ],
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: resolve(__dirname, 'src/css'),
          to: resolve(__dirname, 'static/css')
        }
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", 'postcss-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/i,
        type: "asset"
      },
      {
        test: /\.html$/i,
        loader: "html-loader",
        options: {
          esModule: false
        }
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
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ],
  },
  devServer: {
    static: {
      directory: resolve(__dirname, 'src'),
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
  performance: { hints: false },
  // mode: 'development',
  // devtool: 'source-map'
  mode: 'production',
  optimization: {
    // 压缩css
    minimizer: [
      new CssMinimizerPlugin(),
    ],
  },
}