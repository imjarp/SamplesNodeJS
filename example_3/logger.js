
var EventEmitter  = require('events').EventEmitter;

var logger  = new EventEmitter();

logger
//logger.emit('error','Ups we have an error');

logger.on('error',function (message) {
	console.log(message);
});

module.exports = logger;