var http = require('http');
var log = require('./logger.js');

http.createServer(function(request,response){

response.writeHead(200);

log.emit('error','Hi emit');
response.end('Hello');


}).listen(8080);