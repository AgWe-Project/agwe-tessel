var domain = document.domain;
var socket = io('http://'+ domain);

const AGWE_DB = "AgWe Data";
const DB_VERSION = 1;
const DB_STORES = ["temp", "humid", "light"];

var db;
var tempdata = [],
	humiddata = [],
	lightdata = [];

function openDB(){
	console.log("open db");
	var req_db = indexedDB.open(AGWE_DB, DB_VERSION);
	req_db.onsuccess = function (evt) {
		db = this.result;
		console.log("db open");
		fetchData(DB_STORES[0], tempdata);
		fetchData(DB_STORES[1], humiddata);
		fetchData(DB_STORES[2], lightdata);
	};
	req_db.onerror = function (evt) {
		console.error("openDb error:", evt.target.errorCode);
	};
	req_db.onupgradeneeded = function (event) {
		console.log("upgrading db");
		var db = event.target.result;
		var tempStore = db.createObjectStore(DB_STORES[0], { keyPath: "timestamp" });
		var humidStore = db.createObjectStore(DB_STORES[1], { keyPath: "timestamp" });
		var lightStore = db.createObjectStore(DB_STORES[2], { keyPath: "timestamp"  });
	};
}

function getObjectStore(store_name, mode) {
	var tx = db.transaction(store_name, mode);
	return tx.objectStore(store_name);
}

function storeReading(store_name, data) {
	data.timestamp = Date.now();
	var store = getObjectStore(store_name, 'readwrite');
	var rq;
	try {
		req = store.add(data);
	} catch (e) {
		throw e;
	}
	req.onsuccess = function (evt) {
		console.log(store_name, " Insertion in DB successful");
	};
	req.onerror = function() {
		console.error(store_name, " DB Insert error: ", this.error);
	};
}

function fetchData(store_name, data_array){
	var store = getObjectStore(store_name, 'readonly');
	store.openCursor().onsuccess = function(event) {
		var cursor = event.target.result;
		if (cursor) {
			data_array.push(cursor.value);
			cursor.continue();
		}
		else {
			console.log("Got all" + store_name + " data ");
			displayData(store_name, data_array);
		}
	};
}

function displayData(store_name, data_array) {
	var tbodyID = store_name + "-body";
	var tbody = document.getElementById(tbodyID);
	data_array.forEach(function(dobj){
		var formatdate = new Date(dobj.timestamp);
		tbody.innerHTML = tbody.innerHTML + "<tr><td>" + formatdate +"</td><td>" + dobj[store_name] + "</td></tr>";
	});
}

socket.on('temp', function (data) {
	console.log(data);
	document.getElementById("temp").innerHTML = data.temp;
	storeReading("temp", data);
});

socket.on('humid', function (data) {
	console.log(data);
	document.getElementById("humid").innerHTML = data.humid;
	storeReading("humid", data);
});

socket.on('light', function (data) {
	console.log(data);
	document.getElementById("light").innerHTML = data.light;
	storeReading("light", data);
});

openDB();
