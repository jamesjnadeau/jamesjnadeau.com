Error.stackTraceLimit = Infinity;

require('dotenv').config();

var pathUtil = require('path');
var glob = require('glob');
var webpack = require('webpack');
// var critical = require('critical');

//Plugins
var MiniCssExtractPlugin = require("mini-css-extract-plugin");
var PurgecssPlugin = require('purgecss-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var staticSiteLoader = require('./static-site-loader');
var { CleanWebpackPlugin } = require('clean-webpack-plugin');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
var WorkboxPlugin = require('workbox-webpack-plugin');


var env = require('./sanitizedEnv');

var plugins = [
  new CleanWebpackPlugin(),
  new MiniCssExtractPlugin({
    // Options similar to the same options in webpackOptions.output
    // both options are optional
    filename: '[name].css',
    chunkFilename: '[id].css',
  }),
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
];

if (process.env.NODE_ENV === 'production') {
  plugins.push(new BundleAnalyzerPlugin({
    analyzerMode: 'static',
    openAnalyzer: false, // access it at /report.html
  }));
  plugins.push(new WorkboxPlugin.GenerateSW({
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
  }));
}

// Feedly loader
if (!process.env.DISABLE_FEEDLY) {
  var feedlyContentLoader = require('./feedly-content-loader');
  plugins.push(new feedlyContentLoader());
}


if (process.env.NODE_ENV === 'production') {
  plugins.push(new PurgecssPlugin({
    paths: function () {
      var contentDir = pathUtil.resolve(__dirname, './content');
      var files = glob.sync(contentDir + '/**', {
        nodir: true,
      });

      var templateDir = pathUtil.join(__dirname, 'templates');
      files = files.concat(glob.sync(templateDir + '/**', {
        nodir: true,
      }));

      var viewsDir = pathUtil.join(__dirname, 'views');
      files = files.concat(glob.sync(viewsDir + '/**', {
        nodir: true,
      }));

      var jsDir = pathUtil.join(__dirname, 'assets/js');
      files = files.concat(glob.sync(jsDir + '/**', {
        nodir: true,
      }));

      files.push('feedly-content-loader.js');

      return files;
    },
  }));
}

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
  };
}


module.exports = {
  mode,
  //enable source-maps
  devtool: 'source-map',
  optimization,

  module: {
    rules: [
      { test: /\.html$/, use: "html-loader" },
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
    'site-generator': 'static-site-loader!./content',
    frontend: './assets/js/index.js',
    styles: './assets/styles/index.js',
    impress: './assets/impress/index.js',
    "impress-styles": './assets/impress/styles/index.js',
    // 'service-worker': './assets/js/service-worker.js',
  },

  output: {
    filename: "[name].js",
    chunkFilename: "[id].js",
    path: pathUtil.resolve(__dirname, 'built'),
    libraryTarget: 'umd',
    sourceMapFilename: '[file].map',
    devtoolModuleFilenameTemplate: 'webpack:///[absolute-resource-path]',
    // publicPath: '/built/',
  },

  plugins: plugins,

  devServer: {
    contentBase: pathUtil.resolve(__dirname, 'built'),
    overlay: true,
    // port: process.env.PORT,
    // historyApiFallback: true,
    // publicPath: "./built",
    // open: false,
    // hot: false
  },

};
