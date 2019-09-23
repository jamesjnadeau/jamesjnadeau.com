var polyfillService = require('polyfill-service');

module.exports.handler = function(event, context, callback) {
  var userAgent = event.headers['user-agent'];
  if (userAgent) {
    polyfillService.getPolyfillString({
      uaString: userAgent,
      minify: true,
      features: {
        IntersectionObserver: {},
        "Object.assign": {},
        Intl: {},
        Promise: {},
        MutationObserver: {},
      },
    }).then(function(bundleString) {
      var response = {
        isBase64Encoded: false,
        statusCode: 200,
        headers: {
          'content-type': 'application/javascript',
          'cache-control': 'public, max-age=2628000', // one month
        },
        body: bundleString,
      };
      callback(null, response);
    });
  } else {
    callback(new Error('No user-agent header was found'));
  }
};
