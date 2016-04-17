// Import the interface to Tessel hardware
var tessel = require('tessel');
var climatelib = require('climate-si7020');
var climate = climatelib.use(tessel.port['A']);

var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');
var url = require('url');
var climateReady = false;

io.on('connection', function (socket) {
		//socket.emit('news', { hello: 'world'  });
	console.log("Socket IO Connected");
	var initReadings = function (self) {
		if (climateReady){
			console.log("climateReady");
			setImmediate(function loop () {
				climate.readTemperature('f', function (err, temp) {
				climate.readHumidity(function (err, humid) {
				console.log('Degrees:', temp.toFixed(4) + 'F', 'Humidity:', humid.toFixed(4) + '%RH');
				socket.emit('temp', { temp: temp.toFixed(4) });
				socket.emit('humid', {humid: humid.toFixed(4)});
				setTimeout(loop, 1000);
				});
				});
			});
		}else{
			console.log('Climate not ready');
			setTimeout(self, 500, self)
		}
	};
	initReadings(initReadings);
//socket.on('my other event', function (data) {
		//console.log(data);
	//});
});


climate.on('ready', function () {
	console.log('Connected to climate module');
	climateReady = true;
});

app.listen(80);
console.log("Server running at http://192.168.1.101:8080/");

function handler (req, res) {

	var path = url.parse(req.url).pathname;
	if (path === '/dashboard.js' || path === '/index.html' || path === "/"){
		path = (path === '/dashboard.js') ? '/dashboard.js' : "/index.html";
		fs.readFile(__dirname + path, servefile)
	}else{
		res.writeHead(404);
		res.end();
	}

	function servefile (err, data) {
		if (err) {
			res.writeHead(500);
			return res.end('Error loading');
		}
		res.writeHead(200);
		res.end(data);
	}
}



