import log4js from 'log4js'
import net from 'net';
import ngeohash from 'ngeohash'

import parser from './parser'
import doApiCall from './api';

let logger = log4js.getLogger();
logger.level = process.env.DEBUG_LEVEL || 'info';

const Influx = require('influx');
// InfluxDB Initialization.
const influx = new Influx.InfluxDB({
	host: process.env.INFLUX_URL,
	database: process.env.INFLUX_DB,
	username: process.env.INFLUX_USER || '',
	password: process.env.INFLUX_PWD || '',
	protocol: process.env.INFLUX_PROTOCOL || 'http'
});

influx.createDatabase(process.env.INFLUX_DB).catch((error) => {
	// if the database exists or the user doesn't have sufficient privileges, this will fail
	logger.warn(error.message);
});

const port = process.env.PORT || 7070;

const server = net.createServer();

server.on('connection', (socket) => {

	logger.info(`CONNECTED: ${socket.remoteAddress}:${socket.remotePort}`)

	socket.on('data', async (data) => {

		socket.end()
		socket.destroy()

		logger.debug('Received data', data.toString())

		const {ip, port, username} = parser(data.toString())
		logger.debug(`Parsed ${username} ${ip} ${port}`)

		const ipLocation = await doApiCall(ip);

		if(!ipLocation) {
			logger.error('No data retrieved, cannot continue')
			return
		}

		const geohashed = ngeohash.encode(ipLocation.lat, ipLocation.lon);
		logger.debug(`Geohashing with lat: ${ipLocation.lat}, lon: ${ipLocation.lon}: ${geohashed}`)

		// Remove lon and lat from tags
		const {lon, lat, ...others} = ipLocation;

		influx.writePoints([
			{
				measurement: 'geossh',
				fields: {
					value: 1
				},
				tags: {
					geohash: geohashed,
					username,
					port,
					ip,
					location: `${ipLocation.regionName}, ${ipLocation.city}`,
					...others
				}
			}
		]);
	})

	socket.on('close', () => {
		logger.info(`CLOSED: ${socket.remoteAddress}:${socket.remotePort}`)
	});
});

server.listen(port, () => {
	logger.info(`TCP Server is running on port ${port}.`);
});
