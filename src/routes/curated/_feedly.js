var _ = require('lodash');
var pathUtil = require('path');
var FeedlyClient = require("node-feedly-developer-client");
var sanitizeHTML = require('sanitize-html');
var cheerio = require('cheerio');
require('../../../dotenv');
console.log('process.env.FEEDLY_REFRESH_TOKEN', process.env.FEEDLY_REFRESH_TOKEN);


// node cachemanager
var cacheManager = require('cache-manager');
// storage for the cachemanager
var fsStore = require('cache-manager-fs');
// initialize caching on disk
var diskCache = cacheManager.caching({
  store: fsStore,
  options: {
    ttl: 60 * 60, // seconds = 1 hour
    maxsize: 1000 * 1000 * 1000, // max size in bytes on disk = 1 GB
    path: pathUtil.join('./cache'),
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
  var data = require('../../../feedly-test-data.json');
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
// var itemTemplate = pug.compileFile(pathUtil.join(__dirname, '/views/feedlyArticle.jade'), {
//   pretty: false,
// });

// var indexTemplate = pug.compileFile(pathUtil.join(__dirname, '/views/feedlyTagIndex.jade'), {
//   pretty: false,
// });

//
// Utility functions
//
function processContent(tagPath, items, resolve) {
  resolve(items.map(function(item) {
    var relPath = 'curated/' + tagPath + '/' + item.published;

    // sanitize content
    // var copy = Object.assign({}, item);
    var copy = _.cloneDeep(item);
    if (copy.content && copy.content.content) {
      // fix iframes and images
      var $ = cheerio.load(item.content.content);
      $('iframe').each(function() {
        var $this = $(this);
        $this.parent().addClass('embed-responsive embed-responsive-16by9');
      });
      $('img').each(function() {
        var $this = $(this);
        $this.addClass('img-fluid');
        var src = $this.attr('src');
        if (src) {
          $this.attr('src', src.replace('http:', ''));
        }
      });
      copy.content.unsanitized = $.html();
      copy.content.content = sanitizeHTML(copy.content.unsanitized, sanitizeOptions);
    }

    return copy;
  }))
}

function getStreamContent(streamId) {
  // eslint-disable-next-line block-scoped-var
  return feedly.request('/v3/streams/contents?count=55&streamId=' + encodeURIComponent(streamId));
}

async function getTag(tagName) { // eslint-disable-line
  var key = 'user/447f76f6-44df-414e-a9af-794a73847bdb/tag/' + tagName;
  return new Promise((resolve, reject) => {
    diskCache.wrap(key, function() {
      return getStreamContent(key);
    }).then(({ body }) => { // response
      // console.info("Found", body.items.length, 'from feedly for tag', tagName);
      // count += body.items.length; // eslint-disable-line no-param-reassign

      // create article pages
      var tagPath = tagName.toLowerCase();
      processContent(tagPath, body.items, resolve);
    }).catch(function(err) { setTimeout(function() { throw err; }); });
  });
}

//
// Webpack plugin code
//
// function feedlyContentLoader(options) { // eslint-disable-line

// }

// feedlyContentLoader.prototype.apply = function(compiler) {
//   // The Compiler begins with emitting the generated assets.
//   // Here plugins have the last chance to add assets to the compiler.assets array.
//   compiler.plugin('emit', function(compilation, callback) {
//     var count = 0;
//     async.waterfall([
//       getTag('Awesome', compilation, count),
//       getTag('Dev', compilation, count),
//       getTag('Laugh', compilation, count),
//       getTag('Learn', compilation, count),
//       getTag('Walter', compilation, count),
//     ], function allDone(err) {
//       if (err) console.log(err);
//       console.log('Emmited Content Files:', count);
//       callback();
//     });
//   });
// };

// module.exports = feedlyContentLoader;

async function JSONresponse(items, res) {
  res.writeHead(200, {
    'Content-Type': 'application/json',
  });

  // Send the list of blog posts to our Svelte component
  res.end(JSON.stringify(items));
}

export { getTag, JSONresponse };