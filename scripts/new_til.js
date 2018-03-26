var fs = require('fs');
var slugger = require('slugger');
var insertLine = require('insert-line');

if (process.argv.length <= 2 || process.argv.length > 3) {
  console.error('You need to define a post title, probably in quotes.');
  process.exit();
}

var now = new Date();
var args = process.argv.slice(2);
var titleName = args[0];
var slugName = slugger(titleName);
var fileName = now.getFullYear() + '-'
  + ("0" + (now.getMonth() + 1)).slice(-2) + '-'
  + ("0" + now.getDate()).slice(-2) + '-' + slugName;


var newFile = fs.createWriteStream('./content/TIL/' + fileName + '.jade');
fs.createReadStream('./content/TIL/template.jade')
  .pipe(newFile);

console.log('A new TIL was create at', './content/TIL/' + fileName + '.jade');

var indexLink = "        a.list-group-item(href='/TIL/" + slugName + "/index.html') #[b "
  + (now.getMonth() + 1) + "/" + now.getDate() + "] " + titleName;
insertLine('./content/TIL/index.jade').contentSync(indexLink).at(16);
