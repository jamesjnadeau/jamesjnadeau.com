var pathUtil = require('path');
var marked = require('marked');
var jade = require('jade');
var RSS = require('rss');
var version = require('package')(__dirname).version;

var notJadeContent = [];
var template;
var tilURLs;

var feedOptions = {
  title: 'James\' Today I ... ',
  description: 'A collection of things I found interesting at the time.',
  site_url: 'https://jamesjnadeau.com',
}

module.exports = {
  //perform any preprocessing tasks you might need here.
  preProcess: function(source, path) { //source
    //watch the content directory for changes
    this.addContextDependency(path);
    //Define our template path
    var templatePath = 'templates/default.jade';
    //watch the template for changes
    this.addDependency(templatePath);
    //Compile the template for use later
    template = jade.compileFile(templatePath, { pretty: false });
    // clear out shared vars for new run
    notJadeContent = [];
    tilURLs = [];
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

    if (urlPath.substring(0, 3) === 'TIL'
    && urlPath.length > 4 && urlPath !== 'TIL/template') {
      tilURLs.push(urlPath);
    }

    return urlPath;
  },

  processFile: function(file, content, callback) {
    var ensureCritical = function(ensureContent) {
      /* critical.generate({
        base: 'built/',
        html: ensureContent,
        width: 1920,
        height: 1080,
        // inline: true,
        minify: true,
      }, function (err, output) {
        callback(output);
      });
      */
      callback(ensureContent);
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
      var fileContents = template({
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

  postProcess: function() { // files
    // Create TIL rss feed
    var feed = new RSS(feedOptions);
    tilURLs.forEach(function(url) {
      var urlParts = url.split('-');
      var date = urlParts.slice(0, 3).join('-');
      var name = urlParts.slice(3).join(' ');
      // upper case first letter
      name = name.charAt(0).toUpperCase() + name.slice(1);
      feed.item({
        date: new Date(date),
        title: name,
        url: 'https://jamesjnadeau.com/' + url + '/index.html',
      });
    });
    var feedXml = feed.xml({ indent: true });
    this.emitFile('TIL/rss.xml', feedXml);
  },
};
