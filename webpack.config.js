
require('dotenv').config();

var pathUtil = require('path');
var glob = require('glob');
var webpack = require('webpack');
// var critical = require('critical');

//Plugins
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var PurgecssPlugin = require('purgecss-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var staticSiteLoader = require('./static-site-loader');
var feedlyContentLoader = require('./feedly-content-loader');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
var WorkboxPlugin = require('workbox-webpack-plugin');


var env = require('./sanitizedEnv');

var plugins = [
  new BundleAnalyzerPlugin({
    analyzerMode: 'static',
    openAnalyzer: false, // access it at /report.html
  }),
  new ExtractTextPlugin("[name].css", { sourceMap: true }), // allChunks: true,
  new CopyWebpackPlugin([
    //Copy folders in wholesale
    { from: 'assets/files', to: 'files' },
    { from: 'assets/icons', to: 'icons' },
    { from: 'assets/wind', to: 'wind' },
    { from: 'assets/ski-free', to: 'ski-free' },
    { from: 'assets/graph', to: 'graph' },
    { from: 'assets/manifest.json', to: 'manifest.json' },
  ]),
  // make jQuery available everywhere
  new webpack.ProvidePlugin({
    $: 'jquery',
    jQuery: 'jquery',
    'window.jQuery': 'jquery',
  }),
  // define ENV variables
  new webpack.DefinePlugin({
    env: JSON.stringify(env),
  }),
  new webpack.LoaderOptionsPlugin({
    options: {
      staticSiteLoader: staticSiteLoader,
    },
  }),
  new webpack.optimize.UglifyJsPlugin({
    sourceMap: true,
  }),
  new WorkboxPlugin.GenerateSW({
    include: [
      /\.js|\.css/,
    ],
    runtimeCaching: [
      {
        urlPattern: /\.css|\.js|\.html/,
        handler: 'StaleWhileRevalidate',
        options: {
          matchOptions: {
            ignoreSearch: true,
          },
        },
      },
      {
        urlPattern: /\.pdf$/,
        handler: 'CacheFirst',
      },
      {
        urlPattern: /\.jpg$/,
        handler: 'CacheFirst',
      },
      {
        urlPattern: /\.png$/,
        handler: 'CacheFirst',
      },
    ],
  }),
];

if (process.env.FEEDLY_REFRESH_TOKEN) {
  plugins.push(new feedlyContentLoader());
}

if (process.env.NODE_ENV === 'production') {
  plugins.push(new PurgecssPlugin({
    paths: function () {
      var contentDir = pathUtil.resolve(__dirname, './content');
      var files = glob.sync(contentDir + '/**', { //.(md|jade)
        nodir: true,
      });

      var templateDir = pathUtil.join(__dirname, 'templates');
      files = files.concat(glob.sync(templateDir + '/**', { //.(md|jade)
        nodir: true,
      }));
      var jsDir = pathUtil.join(__dirname, 'assets/js');
      files = files.concat(glob.sync(jsDir + '/**', { //.(md|jade)
        nodir: true,
      }));

      return files;
    },
  }));
}

var styleLoader = ExtractTextPlugin.extract({
  fallback: 'style-loader?sourceMap',
  use: [{
    loader: 'css-loader',
    options: { sourceMap: true, minimize: true },
  }, {
    loader: 'less-loader',
    options: { sourceMap: true },
  }],
});

module.exports = {
  //enable source-maps
  devtool: 'source-map',

  module: {
    loaders: [
      { test: /\.html$/, loader: "html-loader" },
      { test: /\.(css|less)$/,
        loader: styleLoader,
      },
      /*{
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: [
          'file?hash=sha512&digest=hex&name=[hash].[ext]',
          'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false',
        ],
      },*/
      { test: /\.(jpe?g|png|gif)$/, loader: 'file-loader' },
      // taken from gowravshekar/bootstrap-webpack
      { test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?mimetype=application/font-woff' }, //eslint-disable-line
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?mimetype=application/octet-stream' }, //eslint-disable-line
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file-loader' },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?mimetype=image/svg+xml' },
    ],
  },

  entry: {
    'site-generator': 'static-site-loader!./content',
    frontend: './assets/js/index.js',
    styles: './assets/styles/index.js',
    // 'service-worker': './assets/js/service-worker.js',
  },

  output: {
    filename: "[name].js",
    chunkFilename: "[id].js",
    path: pathUtil.resolve(__dirname, './built'),
    libraryTarget: 'umd',
    sourceMapFilename: '[file].map',
    devtoolModuleFilenameTemplate: 'webpack:///[absolute-resource-path]',
    // publicPath: '/built/',
  },

  plugins: plugins,

  devServer: {
    contentBase: "./built",
    // overlay: true,
  },

};
