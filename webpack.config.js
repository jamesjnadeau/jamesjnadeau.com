var pathUtil = require('path');
var marked = require('marked');
var jade = require('jade');
var webpack = require('webpack');
var critical = require('critical');

//Plugins
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var CopyWebpackPlugin = require('copy-webpack-plugin');
var DashboardPlugin = require('webpack-dashboard/plugin');

var notJadeContent = [];

var version = require('package')(__dirname).version;
console.log('Version', version);
var env = {
  version: version,
  NODE_ENV: process.env.NODE_ENV,
};


var plugins = [
  new ExtractTextPlugin("[name].css", { allChunks: true }),
  new CopyWebpackPlugin([
    //Copy folders in wholesale
    { from: 'assets/files', to: 'files' },
    { from: 'assets/icons', to: 'icons' },
    { from: 'assets/wind', to: 'wind' },
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
];

if (process.env.NODE_ENV === 'development') {
  plugins.unshift(new DashboardPlugin());
}


module.exports = {
  //enable source-maps
  devtool: 'source-map',

  module: {
    loaders: [
      { test: /\.html$/, loader: "html-loader" },
      { test: /\.css$/,
       loader: ExtractTextPlugin.extract("style-loader", "css-loader"),
      },
      { test: /\.less$/, loader: "style-loader!css-loader!less-loader" },
      /*{
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: [
          'file?hash=sha512&digest=hex&name=[hash].[ext]',
          'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false',
        ],
      },*/
      { test: /\.(jpe?g|png|gif)$/, loader: 'file-loader?name=[path][name].[ext]' },
      // taken from gowravshekar/bootstrap-webpack
      { test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/font-woff' }, //eslint-disable-line
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/octet-stream' }, //eslint-disable-line
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file' },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=image/svg+xml' },
    ],
  },

  entry: {
    'site-generator': 'static-site-loader!./content',
    frontend: './assets/js/index.js',
    styles: './assets/styles/index.js',
    'service-worker': './assets/js/service-worker.js',
  },

  output: {
    filename: "[name].js",
    chunkFilename: "[id].js",
    path: 'built',
    libraryTarget: 'umd',
  },

  plugins: plugins,

  devServer: {
    contentBase: "./built",
  },

  staticSiteLoader: {
    //perform any preprocessing tasks you might need here.
    preProcess: function() { //source
      //Define our template path
      var templatePath = 'templates/default.jade';

      //watch the template for changes
      this.addDependency(templatePath);

      //Compile the template for use later
      this.template = jade.compileFile(templatePath, { pretty: false });
    },
    //Test if a file should be processed or not, should return true or false;
    testToInclude: function(path) { // stats, absPath
      return pathUtil.extname(path) === '.md' || pathUtil.extname(path) === '.jade';
    },
    //allows you to rewrite the url path that this will be uploaded to
    rewriteUrlPath: function(path, stats, absPath) {
      var extensionSize;
      if (pathUtil.extname(path) === '.md') {
        extensionSize = -3;
      } else {
        extensionSize = -5;
        this.addDependency(absPath);
      }

      //strip out the extension
      var urlPath = path.slice(0, extensionSize);

      //rewrite /index to be just /, making index.md files become the folder index properly
      urlPath = urlPath.replace('index', '');

      //store these for later
      if (extensionSize === -3) {
        notJadeContent.push(urlPath);
      }

      return urlPath;
    },

    processFile: function(file, content, callback) {
      var ensureCritical = function(content) {
        critical.generate({
            base: 'built/',
            html: content,
            width: 1920,
            height: 1080,
            // inline: true,
            minify: true,
        }, function (err, output) {
            callback(content);
        });
      };

      if (pathUtil.extname(file.absPath) === '.md') { //this is a regular markdown file
        //Assemeble some meta data to use in template
        //match pico header info
        //see https://github.com/picocms/Pico/blob/v1.0.0-beta.2/lib/Pico.php#L760
        var picoCMSMetaPattern = /^\/\*(([\s\S])*?)\*\//;
        var meta = {};
        var temp = content.match(picoCMSMetaPattern);
        temp[1].split(/\r?\n/).forEach(function(value) {
          var row = value.split(':');
          meta[row[0]] = row[1];
        });

        //use compiled template to produce html file
        var fileContents = this.template({
          title: meta.Title,
          description: meta.Description,
          content: marked(content.replace(picoCMSMetaPattern, '')),
          version: version,
        });

        ensureCritical(fileContents);
      } else {
        // new jade file type
        ensureCritical(jade.render(content, {
          pretty: false,
          filename: file.absPath,
          version: version,
        }));
      }
    },
  },
};
