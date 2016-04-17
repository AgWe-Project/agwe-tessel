var socket = io('http://AgWe.local');
socket.on('temp', function (data) {
  console.log(data);
	document.getElementById("temp").innerHTML = data.temp;
  //socket.emit('my other event', { my: 'data' });
});

socket.on('humid', function (data) {
  console.log(data);
	document.getElementById("humid").innerHTML = data.humid;
});
