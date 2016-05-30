var http = require('http');
var fs = require('fs');

http.createServer(function (request,response) {

	var newFile = fs.createWriteStream('newFile.txt');
	request.pipe(response);


}).listen(8080);