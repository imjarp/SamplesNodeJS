var http = require("http");
var fs = require("fs");

http.createServer(function(request,response){

response.writeHead(200);

fs.readFileAsync("index.html",function (error, contents) {
	
	response.setHeader('Content-Type','text/html');
	response.write(contents);
	response.end();


});


});

console.log("listening on port 8080");