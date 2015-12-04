// take a folder and return a fully mapped array of it's contents
// this is currently geared towards markdown
var loaderUtil = require('loader-utils');
var filewalker = require('filewalker');
var async = require('async');
var fs = require('fs');
var jade = require('jade');
var pathUtil = require('path');
var marked = require('marked');

var templatePath = 'templates/default.jade';
var template = jade.compileFile(templatePath, {
  pretty: false,
});

module.exports = function(source, map) {
  var self = this;
  self.cacheable();

  var contentPath = pathUtil.dirname(self.resourcePath);
  
  //Add watching/dependency
  self.addContextDependency(contentPath);
  self.addDependency(templatePath);

  var callback = self.async();
  //Assemble the paths
  async.waterfall([
    function(doneWithDirectory) {
      
      var files = [];
      filewalker(contentPath)
        .on('file', function(path, stats, absPath) {
        //check if it's a .md file
        if(pathUtil.extname(path) === '.md') {
          //strip out the extension
          var urlPath = path.slice(0, -3);
          //rewrite /index to be just /, making index.md files become the folder index properly
          urlPath = urlPath.replace('index', '');

          files.push({
            urlPath: urlPath,
            path: path,
            absPath: absPath
          });
        }
      })
      .on('done', function() {
        doneWithDirectory(null, files);
      })
      .walk();
    },
    function(files, filesDone) {
      async.each(files, function(file, fileEmitted){
        //console.log('opening', absPath)
        var absPath = file.absPath;
        var urlPath = file.urlPath;
        fs.readFile(absPath, 'utf8', function(err, markdown) {
          //match pico header info
          //see https://github.com/picocms/Pico/blob/v1.0.0-beta.2/lib/Pico.php#L760
          var picoCMSMetaPattern = /^\/\*(([\s\S])*?)\*\//;
          var meta = {};
          var temp = markdown.match(picoCMSMetaPattern);
          temp[1].split(/\r?\n/).forEach(function(value){
            var row = value.split(':');
            meta[row[0]] = row[1];
          });
          //console.log(meta);
          var fileContents = template({
            title: meta.Title,
            description: meta.Description,
            content: marked(markdown.replace(picoCMSMetaPattern, ''))
          });
          var outputFileName = pathUtil.join(urlPath, '/index.html')
            .replace(/^(\/|\\)/, ''); // Remove leading slashes for webpack-dev-server
          //console.log('emit file', outputFileName, fileContents.length);
          self.emitFile(outputFileName, fileContents);
          fileEmitted();
        });
      }, filesDone);
    }
  ], function() {
    //console.log('Content Processing Done');
    callback(null, source);
  });
};