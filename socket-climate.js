var ip = require('ip');
//Import tessel hardware interfaces
var tessel = require('tessel');
var climate = require('climate-si7020').use(tessel.port['A']);
var ambient = require('ambient-attx4').use(tessel.port['B']);

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
  },
  lightListener: function () {
    ambient.getLightLevel(function (err, light){
      io.emit('light', {light: light});
    });
  }
};

climate.on('ready', function () {
  console.log('Connected to climate module');
  setInterval(monitor.tempListener, 30000);
  setTimeout(function(){
    setInterval(monitor.humidListener,30000);
  }, 15000);
});

ambient.on('ready', function () {
  console.log('Connected to ambient module');
  setInterval(monitor.lightListener, 30000);
});

io.on('connection', function (socket) {
  console.log("Socket IO Connected");
});

app.listen(80);
console.log("Server running at ", ip.address());
