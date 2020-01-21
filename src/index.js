const geohash = require('ngeohash');
const axios = require('axios');
const Influx = require('influx');

// TCP handles
const net = require('net');
const port = 7070;
const host = '127.0.0.1';

const server = net.createServer();
server.listen(port, host, () => {
	console.log('TCP Server is running on port ' + port + '.');
});

// InfluxDB Initialization.
const influx = new Influx.InfluxDB({
	host: process.env.INFLUX_URL,
	database: process.env.INFLUX_DB
});

let sockets = [];

server.on('connection', function(sock) {
	console.log('CONNECTED: ' + sock.remoteAddress + ':' + sock.remotePort);
	sockets.push(sock);

	sock.on('data', function(data) {
		//console.log(data);
		let message = JSON.parse('' + data);
		// API Initialization.
		const instance = axios.create({
			baseURL: 'http://ip-api.com/json/'
		});
		instance
			.get(`/${message.ip}`)
			.then(function(response) {
				const apiResponse = response.data;
				influx.writePoints([
					{
						measurement: 'geossh',
						fields: {
							value: 1
						},
						tags: {
							geohash: geohash.encode(apiResponse.lat, apiResponse.lon),
							username: message.username,
							port: message.port,
							ip: message.ip
						}
					}
				]);
				console.log('Intruder added');
			})
			.catch(function(error) {
				console.log(error);
			});
	});

	// Add a 'close' event handler to this instance of socket
	sock.on('close', function(data) {
		let index = sockets.findIndex(function(o) {
			return o.remoteAddress === sock.remoteAddress && o.remotePort === sock.remotePort;
		});
		if (index !== -1) sockets.splice(index, 1);
		console.log('CLOSED: ' + sock.remoteAddress + ' ' + sock.remotePort);
	});
});
