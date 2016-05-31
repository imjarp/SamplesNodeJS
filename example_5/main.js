var http = require('http');
var helloBaby = require('./hello');
var gb = require('./goodbye');
var myModule = require('./custom');

http.createServer(function (request,response) {

	response.writeHeader(200);

	helloBaby();

	gb.goodbye();

	myModule.foo();
	
	myModule.bar();

	response.end();

	
}).listen(8080);
