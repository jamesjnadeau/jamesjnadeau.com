
var filewalker = require('filewalker');
var async = require('async');
var fs = require('fs');
var jade = require('jade');
var pathUtil = require('path');
var marked = require('marked');

//Plugins
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var CopyWebpackPlugin = require('copy-webpack-plugin');


module.exports = {
  //enable source-maps
  devtool: 'source-map',

  module: {
    loaders: [
      { test: /\.html$/, loader: "html-loader" },
      { test: /\.css$/, 
       //loader: "style-loader!css-loader"
       loader: ExtractTextPlugin.extract("style-loader", "css-loader")
      },
      { test: /\.less$/, loader: "style-loader!css-loader!less-loader"},
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: [
          'file?hash=sha512&digest=hex&name=[hash].[ext]',
          'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
        ]
      }
    ],
  },

  entry: {
    'site-generator': './loaders/static-site-loader!./content',
    'frontend': './assets/js/index.js',
    'styles': './assets/styles/index.js'
  },

  output: {
    filename: "[name].js",
    chunkFilename: "[id].js",
    path: 'built',
    libraryTarget: 'umd'
  },

  externals: {
    // require("jquery") is external and available
    //  on the global var jQuery
    "jquery": "jQuery"
  },

  plugins: [
    new ExtractTextPlugin("[name].css", { allChunks: true }),
    new CopyWebpackPlugin([
      //Copy folders in wholesale
      { from: 'assets/files', to: 'files' },
      //{ from: 'assets/styles', to: 'styles' },
      { from: 'assets/wind', to: 'wind' },
      { from: 'assets/graph', to: 'graph' },
    ]),
  ],

   devServer: {
        contentBase: "./built",
    }
};