var http = require('http');
var fs = require('fs');

var request = require('request');
/*
Readable Stream => Request

Readable events
---------------------- 
'readable' 
 'end'
 
 
Writable Stream => Response

*/


/**
 * Testing
 *  node writable_sample.js
 *  curl -d 'Hello' http://localhost:8080
 * 
 *  curl -upload-file readme.md http://localhost:8080
 */

http.createServer(function(request,response){
response.writeHead(200);

var params = {
    'user-id': 'pocketpay',
    'api-key': 'naND3yr24AN48N18Azz6lypMloopfkrvHDSAY6XLs01z57RH',
    'ip': '162.209.104.195'
};


request.post(
    'https://neutrinoapi.com/ip-info',
    {form: params},
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
          var result = JSON.parse(body);
          console.log(result['country']);
          console.log(result['country-code']);
          console.log(result['region']);
          console.log(result['city']);
      }
      else
      {

      	console.log(error);
      }
    }
);

/*********************
 * Using pipe
 * *********************
 
 */ 

//request.pipe(response);


/*******************
	Reading & Writing
*******************

request.on('readable',function(){
	var chunk = null;
	while(null!== (chunk=request.read())){
		response.write(chunk);
		console.log(chunk.toString());
	}
	
request.on('end',function(){
	response.end();
});
	
});

 */


/* *******************************************
	Example to write after 5 seconds 
	******************************************
response.write('<p>Dog is running</p>');

setTimeout(function(){
	response.write('<p>Dog is done</p>')
	response.end();
	
},5000);*/


}).listen(8080);


console.log('Listening on port 8080');