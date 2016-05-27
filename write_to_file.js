
//Required file system module
var fs = require('fs');

var file = fs.createReadStream('readme.md');
var newFile = fs.createWriteStream('newFile.md');

file.pipe(newFile);

