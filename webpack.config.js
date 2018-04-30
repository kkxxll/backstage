const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');
let WEBPACK_ENV = process.env.WEBPACK_ENV || 'dev';
console.log(WEBPACK_ENV); 
module.exports = {
  entry: './src/app.jsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: WEBPACK_ENV === 'dev' 
            ? '/dist/' : '//admin.asfor.top/dist',
    filename: 'js/app.bundle.js'
  },
  resolve: {
    alias: {
      page: path.resolve(__dirname, 'src/page'),
      component: path.resolve(__dirname, 'src/component'),
      util: path.resolve(__dirname, 'src/util'),
      service: path.resolve(__dirname, 'src/service')
    }
  },
  module: {
    rules: [
      {
        test: /\.jsx$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            // presets: ['@babel/preset-env'] //可简写成env
            presets: ['env', 'react']
          }
        }
      },
      {
        test: /\.css$/,
        //  use: [
        //    'style-loader',
        //    'css-loader'
        //  ]
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader'
        })
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'sass-loader']
        })
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: 'resource/[name].[ext]'
            }
          }
        ]
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|otf)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: 'resource/[name].[ext]'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    // 抽离html
    new HtmlWebpackPlugin({
      template: './src/index.html',
      favicon: './favicon.ico'
    }),
    // 抽离css
    new ExtractTextPlugin('css/[name].css'),
    // 提取公共
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
      filename: 'js/base.js'
    })
  ],
  devServer: {
    port: 8999,
    historyApiFallback: {
      index: '/dist/index.html'
    },
    proxy: {
      '/manage': {
        target: 'http://admintest.happymmall.com',
        changeOrigin: true
      },
      '/user/logout.do': {
        target: 'http://admintest.happymmall.com',
        changeOrigin: true
      }
    }
    // contentBase: './dist'
  }
};
