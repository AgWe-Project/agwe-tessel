var url = require('url');
var fs = require('fs');

module.exports = function handler (req, res){
	var servefile = function  (err, data) {
		if (err) {
			console.log(err);
			res.writeHead(500);
			return res.end('Error loading');
		}
		res.writeHead(200);
		res.end(data);
	};

	var path = url.parse(req.url).pathname;
	if (path === '/dashboard.js' || path === '/index.html' || path === "/"){
		path = (path === '/dashboard.js') ? '/dashboard.js' : "/index.html";
		fs.readFile(__dirname + path, servefile);
	}else if (path === "/chart.js") {
		fs.readFile(__dirname + "/node_modules/chart.js/dist/Chart.js", servefile);
	}else{
		res.writeHead(404);
		res.end();
	}
};
