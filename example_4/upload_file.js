var http = require('http');
var fs = require('fs');

http.createServer(function (request,response) {

	//response.writeHead(200);

	var newFile = fs.createWriteStream('lorem.txt');

	var fileBytes = request.headers['content-length'];

	console.log(request.headers);

	var uploaded = 0;

	request.on('readable',function() {

		var chunk = null;

		while(null!== (chunk =request.read())){

			uploaded += chunk.length;

			var progress = (uploaded/fileBytes)*100;

			response.write("progress " + parseInt(progress,10) + "%\n");

		}
		
	});

	request.pipe(newFile);

	request.on('end',function () {
		response.end('Uploaded');

		
	});


}).listen(8080);