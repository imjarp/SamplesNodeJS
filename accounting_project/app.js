var express = require('express');
var app = express();
var multer = require('multer');
var bodyParser = require('body-parser');

app.use(bodyParser.json());

var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads');
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now());
  }
});

var upload = multer({ storage : storage }).any();

app.get('/',function (request,response) {
	
	response.sendFile(__dirname + "/index.html");
});

app.post('/index.html',function(request,response){

	upload(request,response,function(err){

		if(err){
			console.log(err);
		}
		else
		{
			console.log('sin error');
		}

	});

	console.log('Total de archivos ' + request.files.length )
	response.end();
		
});

app.listen(8080);

console.log('Listening 8080');