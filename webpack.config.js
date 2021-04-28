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
const CopyPlugin = require('copy-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const menu = require('./plugins/sync-menu');
const { load_env } = require('./env');

const hasJsxRuntime = (() => {
  if (process.env.DISABLE_NEW_JSX_TRANSFORM === 'true') {
    return false;
  }

  try {
    require.resolve('react/jsx-runtime');
    return true;
  } catch (e) {
    return false;
  }
})();
module.exports = () => {
  const env = load_env();
  const isProduction = env.NODE_ENV === 'production';
  isProduction ? menu.sync() : menu.watch();
  return {
    entry: './src/index',
    mode: env.NODE_ENV,
    devServer: {
      contentBase: path.join(__dirname, 'dist'),
      port: env.PORT,
      hot: true,
      historyApiFallback: true,
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
      extensions: ['.ts', '.js', '.tsx', '.jsx', '.md', '.mdx', '.json'],
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@content': path.resolve(__dirname, './src/content'),
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
        {
          test: /\.(png|jpe?g|gif|svg|bmp)$/i,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 8192,
              },
            },
          ],
        },
        {
          test: /\.md$/,
          use: [{
            loader: 'babel-loader',
          }, {
            loader: path.resolve(__dirname, './plugins/remark-loader'),
          }],
        },
        {
          test: /\.s[ac]ss$/i,
          use: [{
            // Creates `style` nodes from JS strings
            loader: 'style-loader',
          }, {
            // Translates CSS into CommonJS
            loader: 'css-loader',
          }, {
            loader: 'postcss-loader',
          }, {
            // Compiles Sass to CSS
            loader: 'sass-loader',
          }],
        },
      ],
    },
    plugins: [
      new ModuleFederationPlugin({
        name: 'root-container',
        remotes: {},
        shared: {
          'axios': { singleton: true },
          'react': { singleton: true },
          'react-dom': { singleton: true },
          'react-router-dom': { singleton: true },
        },
      }),
      new HtmlWebpackPlugin({
        template: './public/index.html',
        inject: true,
      }),
      isProduction && new CleanWebpackPlugin(),
      new DefinePlugin({
        'progress.env': Object.keys(env).reduce((previous, key) => {
          previous[key] = JSON.stringify(env[key]);
          return previous;
        }, {}),
      }),
      new InterpolateHtmlPlugin(HtmlWebpackPlugin, Object.assign({}, env, { PUBLIC_URL: env.PUBLIC_URL.replace(/\/$/, '') })),
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
      new ESLintPlugin({
        // Plugin options
        extensions: ['js', 'mjs', 'jsx', 'ts', 'tsx'],
        formatter: require.resolve('react-dev-utils/eslintFormatter'),
        eslintPath: require.resolve('eslint'),
        failOnError: isProduction,
        context: path.resolve(__dirname, './src'),
        cache: true,
        cacheLocation: path.resolve(
          __dirname,
          './node_modules/.cache/.eslintcache',
        ),
        // ESLint class options
        cwd: process.cwd(),
        resolvePluginsRelativeTo: __dirname,
        baseConfig: {
          extends: [require.resolve('eslint-config-react-app/base')],
          rules: {
            ...(!hasJsxRuntime && {
              'react/react-in-jsx-scope': 'error',
            }),
          },
        },
      }),
    ].filter(Boolean),
  };
};
