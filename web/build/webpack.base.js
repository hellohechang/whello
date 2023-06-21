const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    main: './src/page/home/index.js',
    login: './src/page/login/index.js',
    allnote: './src/page/allnote/index.js',
    edit: './src/page/edit/index.js',
    history: './src/page/history/index.js',
    note: './src/page/note/index.js',
    notes: './src/page/notes/index.js',
    pic: './src/page/pic/index.js',
    recycle: './src/page/recycle/index.js',
    root: './src/page/root/index.js',
    sharebm: './src/page/sharebm/index.js',
    sharelist: './src/page/sharelist/index.js',
    sharemusic: './src/page/sharemusic/index.js',
  },
  output: {
    filename: 'js/[name].[chunkhash:8].js',
    path: resolve(__dirname, '..', 'static'),
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/page/login/index.html',
      filename: 'login/index.html',
      chunks: ['login'],
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true
      }
    }),
    new HtmlWebpackPlugin({
      template: './src/page/home/index.html',
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
      filename: 'allnote/index.html',
      chunks: ['allnote'],
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true
      }
    }),
    new HtmlWebpackPlugin({
      template: './src/page/getpd/index.html',
      filename: 'getpd/index.html',
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
      filename: 'edit/index.html',
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
      filename: 'history/index.html',
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
      filename: 'note/index.html',
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
      filename: 'notes/index.html',
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
      filename: 'pic/index.html',
      chunks: ['pic'],
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true
      }
    }),
    new HtmlWebpackPlugin({
      template: './src/page/recycle/index.html',
      filename: 'recycle/index.html',
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
      filename: 'root/index.html',
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
      filename: 'sharebm/index.html',
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
      filename: 'sharemusic/index.html',
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
      filename: 'sharelist/index.html',
      chunks: ['sharelist'],
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true
      }
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/i,
        type: "asset",
        generator: {
          filename: "img/[name].[hash:8][ext]"
        }
      },
      {
        test: /\.html$/i,
        loader: "html-loader",
        options: {
          esModule: false
        }
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
}