const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');

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
    path: resolve(__dirname, '..', 'static'),
    clean: true,
  },
  plugins: [
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
  ],
  module: {
    rules: [
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