var ip = require('ip');
//Import tessel hardware interfaces
var tessel = require('tessel');
var climate = require('climate-si7020').use(tessel.port['A']);

var handler = require('./server.js');
//Start Socket.Import
var app = require('http').createServer(handler)
var io = require('socket.io')(app);

var monitor = {
	tempListener: function () {
		climate.readTemperature('f', function (err, temp){
			io.emit('temp', {temp: temp.toFixed(4)});
		});
	},
	humidListener: function () {
		climate.readHumidity(function (err, humid){
			io.emit('humid', {humid: humid.toFixed(4)});
		});
	}
};

climate.on('ready', function () {
	console.log('Connected to climate module');
	setInterval(monitor.tempListener, 1000);
	setInterval(monitor.humidListener, 1000);
});

io.on('connection', function (socket) {
	console.log("Socket IO Connected");
});

app.listen(80);
console.log("Server running at ", ip.address());
