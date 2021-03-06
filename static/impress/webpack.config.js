var pathUtil = require('path');
var glob = require('glob');
var webpack = require('webpack');
//Plugins
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const PurgecssPlugin = require('purgecss-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

//Plugins
var plugins = [
  new MiniCssExtractPlugin({
    filename: '[name].css',
    chunkFilename: '[id].css',
  }),
  new webpack.ProvidePlugin({
    $: 'jquery',
    jQuery: 'jquery',
    'window.jQuery': 'jquery',
    'window.$': "jquery",
  }),
];

var styleLoader = [
  MiniCssExtractPlugin.loader,
  {
    loader: "css-loader",
    options: {
      sourceMap: true,
    },
  }, {
    loader: 'postcss-loader', // Run post css actions
    options: {
      sourceMap: true, // 'inline',
      plugins: function () { // post css plugins, can be exported to postcss.config.js
        return [
          require('precss'),
          require('autoprefixer'),
        ];
      },
    },
  }, {
    loader: 'sass-loader', // compiles Sass to CSS
    options: {
      sourceMap: true,
    },
  },
];

var mode = 'development';
var optimization = {};
if (process.env.NODE_ENV === 'production') {
  mode = process.env.NODE_ENV;
  optimization = {
    minimize: true,
    splitChunks: {
      chunks: 'all',
    },
  };
}


module.exports = {
  mode,
  //enable source-maps
  devtool: 'source-map',
  optimization,

  module: {
    rules: [
      {
        test: /\.(css|scss)$/,
        use: styleLoader,
      },
      { test: /\.(jpe?g|png|gif)$/, use: 'file-loader' },
      // taken from gowravshekar/bootstrap-webpack
      { test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/, use: 'url-loader?mimetype=application/font-woff' }, //eslint-disable-line
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, use: 'url-loader?mimetype=application/octet-stream' }, //eslint-disable-line
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, use: 'file-loader' },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, use: 'url-loader?mimetype=image/svg+xml' },
    ],
  },

  entry: {
    impress: './static/impress/index.js',
    impress_styles: './static/impress/styles/index.js',
  },

  output: {
    filename: "[name].js",
    chunkFilename: "[name].js",
    path: pathUtil.resolve(__dirname, 'built'),
    libraryTarget: 'umd',
    sourceMapFilename: '[file].map',
    publicPath: '/impress/built/',
  },

  plugins: plugins,
};