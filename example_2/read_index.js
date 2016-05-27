var http = require("http");
var fs = require("fs");

http.createServer(function(request,response){



fs.readFile("index.html",function (error, contents) {
	
	response.setHeader('Content-Type','text/html');
	response.writeHead(200);	
	response.write(contents);
	response.end();


});


}).listen(8080);

console.log("listening on port 8080");