var http  = require('http');

http.createServer(function (request,response) {
	
	response.writeHead(200);

	request.pipe(response);

	/*request.ont('readable',function () {

		var chunk = null;
		while(null!== (chunk = request.read())){


		}
	});

	request.on('end',function (argument) {
		response.end();
		// body...
	});*/

}).listen(8080);

console.log('Listening');