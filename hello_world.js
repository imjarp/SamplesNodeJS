var http = require('http');


http.createServer(function(request,response){
response.writeHead(200);
response.writeHead("Hello, this is dog.");
response.end('Hola mundo');
}).listen(8080);


console.log('Listening on port 8080');