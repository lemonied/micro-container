/**
* @author ChenJiYuan
* @description 主服务webpack配置
* */
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { DefinePlugin } = require('webpack');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const CopyPlugin = require("copy-webpack-plugin");

const { getEnv } = require('./env');

const productionPlugin = (isProduction) => {
  if (isProduction) {
    return [new CleanWebpackPlugin()];
  }
  return [];
}

module.exports = (webpackEnv) => {
  const env = getEnv(webpackEnv);
  const isProduction = env.NODE_ENV === 'production';
  return {
    entry: './src/index',
    mode: 'development',
    devServer: {
      contentBase: path.join(__dirname, 'dist'),
      port: 3001,
    },
    output: {
      path: path.resolve(__dirname, './dist'),
      publicPath: env.PUBLIC_URL,
      filename: isProduction ?
        'static/js/[name].[contenthash:8].js' :
        'static/js/bundle.js',
      chunkFilename: isProduction ?
        'static/js/[name].[contenthash:8].chunk.js' :
        'static/js/[name].chunk.js',
    },
    resolve: {
      extensions: ['.ts', '.js', '.tsx', '.jsx'],
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    module: {
      rules: [
        {
          test: /bootstrap\.(js|ts)x?$/,
          loader: 'bundle-loader',
          options: {
            lazy: true,
          },
        },
        {
          test: /\.(js|ts)x?$/,
          loader: 'babel-loader',
          exclude: /node_modules/,
        },
      ],
    },
    plugins: [
      new ModuleFederationPlugin({
        name: 'root-container',
        remotes: {},
        shared: {
          axios: { singleton: true },
          react: { singleton: true },
          'react-dom': { singleton: true },
          'react-router-dom': { singleton: true },
        },
      }),
      new HtmlWebpackPlugin({
        template: './public/index.html',
        inject: true,
      }),
      ...productionPlugin(isProduction),
      new DefinePlugin({
        'progress.env': Object.keys(env).reduce((previous, key) => {
          previous[key] = JSON.stringify(env[key]);
          return previous;
        }, {}),
      }),
      new InterpolateHtmlPlugin(HtmlWebpackPlugin, env),
      new CopyPlugin({
        patterns: [
          {
            from: 'public',
            filter(file) {
              return !/index\.html$/.test(file);
            },
          },
        ],
        options: {
          concurrency: 100,
        },
      }),
    ],
  };
};
