var async = require('async');
var pathUtil = require('path');
var RawSource = require('webpack-sources/lib/RawSource');
var FeedlyClient = require("node-feedly-developer-client");
var jade = require('jade');
var sanitizeHTML = require('sanitize-html');
var cheerio = require('cheerio');

// node cachemanager
var cacheManager = require('cache-manager');
// storage for the cachemanager
var fsStore = require('cache-manager-fs');
// initialize caching on disk
var diskCache = cacheManager.caching({
  store: fsStore,
  options: {
    ttl: 60 * 60, // seconds
    maxsize: 1000 * 1000 * 1000, // max size in bytes on disk
    path: pathUtil.join(__dirname, 'cache'),
    preventfill: true,
  },
});

var sanitizeOptions = {
  allowedTags: [
    'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol',
    'nl', 'li', 'b', 'i', 'strong', 'em', 'strike', 'code', 'hr', 'br', 'div',
    'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre', 'iframe', 'img',
  ],
  allowedAttributes: {
    a: [
      'href', 'name', 'target',
    ],
    img: [
      'src', 'srcset',
    ],
    iframe: [
      'src',
    ],
    '*': [
      'class', 'id',
    ],
  },
  allowedIframeHostnames: ['www.youtube.com', 'player.vimeo.com'],
  // Lots of these won't come up by default because we don't allow them
  selfClosing: [
    'img', 'br', 'hr', 'area', 'base', 'basefont', 'input', 'link', 'meta',
  ],
  // URL schemes we permit
  allowedSchemes: [
    'https', 'mailto',
  ],
  allowedSchemesByTag: {},
  allowedSchemesAppliedToAttributes: [
    'href', 'src', 'cite',
  ],
  allowProtocolRelative: true,
  transformTags: {
    // p: sanitizeHTML.simpleTransform('p', { class: 'embed-responsive embed-responsive-16by9' }),
  },
};

var feedly;
if (process.env.FEEDLY_REFRESH_TOKEN) {
  feedly = new FeedlyClient({
    refreshToken: process.env.FEEDLY_REFRESH_TOKEN,
    // accessToken: process.env.FEEDLY_ACCESS_TOKEN,
  });
} else {
  console.warn('loading feedly-test-data, see env var FEEDLY_REFRESH_TOKEN to get real data');
  var data = require('./feedly-test-data.json');
  feedly = {
    request: function() {
      return new Promise(function(resolve) {
        resolve({
          body: data,
        });
      });
    },
  };
}

//
// templates
//
var itemTemplate = jade.compileFile(pathUtil.join(__dirname, '/views/feedlyArticle.jade'), {
  pretty: false,
});
var indexTemplate = jade.compileFile(pathUtil.join(__dirname, '/views/feedlyTagIndex.jade'), {
  pretty: false,
});

//
// Utility functions
//
function processContent(tagPath, compilation, items, done) {
  async.eachSeries(items, function(item, itemDone) {
    if (typeof item.published !== 'undefined') {
      var relPath = 'curated/' + tagPath + '/' + item.published;
      var outputFileName = pathUtil.join(relPath, '/index.html')
        .replace(/^(\/|\\)/, ''); // Remove leading slashes for webpack-dev-server

      // sanitize content
      var copy = Object.assign({}, item);
      if (copy.content && copy.content.content) {
        copy.content.content = sanitizeHTML(copy.content.content, sanitizeOptions);
        // fix iframes and images
        var $ = cheerio.load(copy.content.content);
        $('iframe').each(function() {
          var $this = $(this);
          $this.parent().addClass('embed-responsive embed-responsive-16by9');
        });
        $('img').each(function() {
          var $this = $(this);
          $this.addClass('img-fluid');
        });
        copy.content.content = $.html();
      }

      var content = itemTemplate({
        item: copy,
      });

      compilation.assets[outputFileName] = new RawSource(content); // eslint-disable-line no-param-reassign,max-len
    } else {
      console.log('No Published?', item);
    }

    itemDone();
  }, done);
}

function getStreamContent(streamId) {
  // eslint-disable-next-line block-scoped-var
  return feedly.request('/v3/streams/contents?count=500&streamId=' + encodeURIComponent(streamId));
}

function getTag(tagName, compilation, count) {
  var key = 'user/447f76f6-44df-414e-a9af-794a73847bdb/tag/' + tagName;
  return function loadAwesome(done) {
    diskCache.wrap(key, function() {
      return getStreamContent(key);
    }).then(({ body }) => { // response
      console.info("Fetched", body.items.length, 'from feedly for tag', tagName);
      count += body.items.length; // eslint-disable-line no-param-reassign

      // create index file
      var tagPath = tagName.toLowerCase();
      var relPath = 'curated/' + tagPath;
      var outputFileName = pathUtil.join(relPath, '/index.html')
        .replace(/^(\/|\\)/, ''); // Remove leading slashes for webpack-dev-server
      var content = indexTemplate({
        items: body.items,
        tagName,
        tagPath,
      });
      compilation.assets[outputFileName] = new RawSource(content); // eslint-disable-line no-param-reassign,max-len

      // create article pages
      processContent(tagPath, compilation, body.items, done);
    }).catch(function(err) { setTimeout(function() { throw err; }); });
  };
}

//
// Webpack plugin code
//
function feedlyContentLoader(options) { // eslint-disable-line

}

feedlyContentLoader.prototype.apply = function(compiler) {
  // The Compiler begins with emitting the generated assets.
  // Here plugins have the last chance to add assets to the compiler.assets array.
  compiler.plugin('emit', function(compilation, callback) {
    var count = 0;
    async.waterfall([
      getTag('Awesome', compilation, count),
      getTag('Dev', compilation, count),
      getTag('Laugh', compilation, count),
      getTag('Learn', compilation, count),
      getTag('Walter', compilation, count),
    ], function allDone(err) {
      if (err) console.log(err);
      console.log('Emmited Content Files:', count);
      callback();
    });
  });
};

module.exports = feedlyContentLoader;
