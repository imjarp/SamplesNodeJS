
var fs = require('fs');
var xml2js = require('xml2js');
var parseDirectory = function (destinationFolder) {
	// body...
	var files = fs.readdir(destinationFolder,function (err,files){
	if (!err) 
	{

		files.forEach(function(fileName){
			console.log(destinationFolder +'/'+ fileName)
			readFile(destinationFolder +'/'+ fileName);
		});		
	}	
	else
		throw err; 
	});

}


function readFile(fileName)
{
	fs.readFile(fileName,'utf-8', (err, data) => {
  		if (err) throw err;
  		console.log('Leyendo archivo-----------');
		console.log(data);
		console.log('Terminando archivo-----------')
	});

}





exports.parseDirectory = parseDirectory;
