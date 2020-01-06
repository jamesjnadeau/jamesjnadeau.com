var pathUtil = require('path');
// var critical = require('critical');

//Plugins
var plugins = [
];


var styleLoader = [
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
    cms: './static/admin/cms.js',
  },

  output: {
    filename: "[name]-built.js",
    chunkFilename: "[name].js",
    path: pathUtil.resolve(__dirname),
    libraryTarget: 'umd',
    sourceMapFilename: '[file].map',
    publicPath: '/admin/',
  },

  plugins: plugins,
};