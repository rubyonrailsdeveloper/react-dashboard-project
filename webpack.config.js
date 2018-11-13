const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const { TsConfigPathsPlugin } = require('awesome-typescript-loader')
const compact = require('lodash/compact')
const mapValues = require('lodash/mapValues')
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const envConfig = require(process.env.CI ? './env.ci.js' : './env')

const isProd = process.env.NODE_ENV === 'production'
const env = Object.assign(
  {
    NODE_ENV: process.env.NODE_ENV,
  },
  envConfig
)

if (!env.API_BASE) throw new Error('No API_BASE property exported in ./env.js')

if (!env.PUBLIC_PATH) throw new Error('No PUBLIC_PATH property exported in ./env.js')

const scssLoaders = [
  {
    loader: 'css-loader',
    options: {
      importLoaders: 2,
      minimize: isProd,
      sourceMap: isProd,
    },
  },
  {
    loader: 'postcss-loader',
    options: {
      sourceMap: isProd,
    },
  },
  {
    loader: 'sass-loader',
    options: {
      sourceMap: isProd,
    },
  },
]

const config = {
  entry: compact([
    'core-js/client/shim',
    !isProd && 'react-hot-loader/patch',
    './src/index.tsx',
    './src/assets/scss/vendor/index.scss',
    './src/assets/scss/index.scss',
  ]),
  output: {
    filename: isProd ? '[name].[chunkhash:8].js' : 'bundle.js',
    publicPath: env.PUBLIC_PATH,
    path: path.resolve(__dirname, 'dist'),
  },

  devtool: isProd ? 'source-map' : 'cheap-source-map',

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json', '.jsx'],
    plugins: [new TsConfigPathsPlugin()],
  },

  module: {
    rules: [
      // Typescript
      {
        test: /\.tsx?$/,
        use: compact([
          !isProd && 'react-hot-loader/webpack',
          {
            loader: 'awesome-typescript-loader',
            options: {
              transpileOnly: !isProd,
            },
          },
        ]),
      },

      // JavaScript
      { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' },

      // CSS
      { test: /\.scss$/, enforce: 'pre', loader: 'import-glob-loader' },

      {
        test: /\.scss$/,
        use: isProd
          ? ExtractTextPlugin.extract({
              fallback: 'style-loader',
              use: scssLoaders,
            })
          : [
              {
                loader: 'style-loader',
                options: {
                  sourceMap: isProd,
                },
              },
            ].concat(scssLoaders),
      },

      // Fonts
      {
        test: /\.woff(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: 'assets/[hash].[ext]',
              limit: 65000,
              mimetype: 'application/font-woff',
            },
          },
        ],
      },
      {
        test: /\.woff2(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: 'assets/[hash].[ext]',
              limit: 65000,
              mimetype: 'application/font-woff2',
            },
          },
        ],
      },

      {
        test: /\.(gif|jpe?g|png|wav|mp3)(\?\S*)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'assets/[hash].[ext]',
            },
          },
        ],
      },

      // SVG
      {
        test: /\.svg(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: 'assets/[hash].[ext]',
              limit: 80000,
              mimetype: 'image/svg+xml',
            },
          },
        ],
      },
    ],
  },

  plugins: [
    new webpack.DefinePlugin({ 'process.env': mapValues(env, v => JSON.stringify(v)) }),
    new HtmlWebpackPlugin({
      inject: true,
      template: 'index.html',
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  ],

  externals: { 'es6-shim': 'window' },
}

if (isProd) {
  config.plugins = config.plugins.concat([
    new CleanWebpackPlugin(['dist']),
    new ExtractTextPlugin('[name].[contenthash:8].css'),
    new UglifyJSPlugin({
      sourceMap: true,
      parallel: true,
      uglifyOptions: {
        ecma: 5,
        output: {
          comments: false,
        },
      },
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new FaviconsWebpackPlugin({
      title: 'Streaml.io',
      logo: 'src/assets/images/favicon.png',
      icons: {
        favicons: true,
        android: true,
        appleIcon: true,
        appleStartup: false,
        coast: false,
        firefox: false,
        opengraph: false,
        twitter: false,
        yandex: false,
        windows: false,
      },
    }),
  ])

  config.module.rules.push({
    test: /\.tsx?$/,
    loader: 'tslint-loader',
    enforce: 'pre',
    options: {
      emitErrors: true,
    },
  })
} else {
  config.plugins = config.plugins.concat([
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
  ])

  config.devServer = {
    hot: true,
    historyApiFallback: { index: '/' },
    host: '0.0.0.0',
    port: '3030',
    disableHostCheck: true,
    compress: true,
  }
}

module.exports = config
