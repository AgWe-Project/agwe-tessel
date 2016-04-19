var domain = document.domain;
var socket = io('http://'+ domain);

socket.on('temp', function (data) {
  console.log(data);
	document.getElementById("temp").innerHTML = data.temp;
});

socket.on('humid', function (data) {
  console.log(data);
	document.getElementById("humid").innerHTML = data.humid;
});

socket.on('light', function (data) {
	console.log(data);
	document.getElementById("light").innerHTML = data.light;
});
