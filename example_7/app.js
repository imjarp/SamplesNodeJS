var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

io.on('connection',function (client) {
	console.log('Client connected...');

	client.emit('messages',{hello:'world'});
	// body...
});

app.get('/',function (req, res) {
	// body...

	res.sendFile(__dirname + "/index.html");
});


app.listen(8080);