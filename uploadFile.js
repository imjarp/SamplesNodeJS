var fs = require('fs');
var http = require('http');


/**
 * Testing
 *  node uploadFile.js
 * 
 *  curl --upload-file readme.md http://localhost:8080
 */

http.createServer(function(request,response){
 
var newFile = fs.createWriteStream('request_downloaded.txt');
var fileBytes = request.headers['content-length'];
var uploadBytes = 0;

request.on('readable',function(){
	var chunk = null;
	
	while(null!==(chunk = request.read())){
		
		uploadBytes += chunk.length;
		var progress = (uploadBytes/ fileBytes) * 100;
		
		response.write('progress : ' + parseInt(progress,10) + '%n');
	}
	
	
});

request.pipe(newFile);
  
 request.on('end',function(){
	
	response.end('uploaded'); 
 });




/*
response.writeHead(200);
console.log('Entre');

request.pipe(newFile);
  
 request.on('end',function(){
	
	response.end('uploaded'); 
 });
 
console.log('Sali');*/

}).listen(8080);


console.log('Listening on port 8080');