const webpack = require('webpack');
const { resolve } = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const MinaWebpackPlugin = require('./plugin/MinaWebpackPlugin');
const MinaRuntimePlugin = require('./plugin/MinaRuntimePlugin');

const isDebug = process.env.BUILD_TYPE !== 'release';

module.exports = {
  context: resolve('src'),
  entry: './app.js',
  output: {
    path: resolve('dist'),
    filename: '[name].js',
    globalObject: 'wx',
  },
  plugins: [
    new MinaWebpackPlugin({
      scriptExtensions: ['.js'],
      assetExtensions: ['.scss'],
    }),
    new MinaRuntimePlugin(),
    new CleanWebpackPlugin({
      cleanStaleWebpackAssets: false,
    }),
    // 复制/src下文件到/dist
    new CopyWebpackPlugin([
      {
        from: '**/*',
        to: './',
        ignore: ['**/*.js', '**/*.scss'],
      },
    ]),
    // 配置多环境
    new webpack.EnvironmentPlugin({
      NODE_ENV: JSON.stringify(process.env.NODE_ENV) || 'development',
      BUILD_TYPE: JSON.stringify(process.env.BUILD_TYPE) || 'debug',
    }),
  ],
  module: {
    rules: [
      // babel处理js
      {
        test: /\.js$/,
        use: 'babel-loader',
      },
      // sass支持
      {
        test: /\.(scss)$/,
        include: /src/,
        use: [
          {
            loader: 'file-loader',
            options: {
              useRelativePath: true,
              name: '[path][name].wxss',
              context: resolve('src'),
            },
          },
          {
            loader: 'sass-loader',
            options: {
              includePaths: [resolve('src', 'styles'), resolve('src')],
            },
          },
        ],
      },
    ],
  },
  optimization: {
    runtimeChunk: {
      name: 'runtime',
    },
    splitChunks: {
      chunks: 'all',
      name: 'common',
      minChunks: 2,
      minSize: 0,
    },
  },
  mode: isDebug ? 'none' : 'production',
  devtool: isDebug ? 'inline-source-map' : 'source-map',
};
