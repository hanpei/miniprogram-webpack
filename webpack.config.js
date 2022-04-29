const webpack = require('webpack');
const { resolve } = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HappyPack = require('happypack');

const MinaWebpackPlugin = require('./plugin/MinaWebpackPlugin');
const MinaRuntimePlugin = require('./plugin/MinaRuntimePlugin');

const isDebug = process.env.NODE_ENV !== 'production';

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
      DIST_ENV: JSON.stringify(process.env.DIST_ENV) || 'test',
    }),
    new HappyPack({
      loaders: ['babel-loader?cacheDirectory'],
      threadPool: HappyPack.ThreadPool({ size: require('os').cpus().length }),
      verbose: true,
    }),
  ],
  module: {
    rules: [
      // babel处理js
      {
        test: /\.js$/,
        use: 'happypack/loader',
        include: /src/,
        exclude: /node_modules/,
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
              implementation: require('sass'),
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
    concatenateModules: true,
  },
  resolve: {
    alias: {
      '@common': resolve(__dirname, 'src/common'),
      '@components': resolve(__dirname, 'src/components'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@assets': resolve(__dirname, 'src/assets'),
    },
  },
  mode: isDebug ? 'none' : 'production',
  devtool: isDebug ? 'inline-source-map' : 'source-map',
  cache: true,
};
