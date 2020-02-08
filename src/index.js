import log4js from 'log4js'
import net from 'net';
import ngeohash from 'ngeohash'

import parser from './parser'
import retrieveLocationFromAPI from './api';

let logger = log4js.getLogger();
logger.level = 'debug';

const Influx = require('influx');
// InfluxDB Initialization.
const influx = new Influx.InfluxDB({
	host: process.env.INFLUX_URL || '127.0.0.1',
	database: process.env.INFLUX_DB || 'influx'
});

const port = process.env.PORT || 7070;
const host = '0.0.0.0';

/**
 * @typedef {Object} APIResponse
 * @property {string} status
 * @property {string} country
 * @property {string} countryCode
 * @property {string} region
 * @property {string} regionName
 * @property {string} city
 * @property {string} zip
 * @property {number} lat
 * @property {number} lon
 * @property {string} timezone
 * @property {string} isp
 * @property {string} org
 * @property {string} as
 * @property {string} query
 */
 
/**
 * 
 * Memoization to prevent API Calls for the same IP
 * @type {Object.<string, APIResponse>}
 */
const clients = {};

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

/**
 * @param {string} ip 
 * @returns {Promise<APIResponse>}
 */
async function doApiCall(ip) {

	// Memoization, prevent API call for the same IP
	if(clients[ip]) {
		return clients[ip]
	}

	try {
		const data = await retrieveLocationFromAPI(ip)
		clients[ip] = data
		return data
	} catch(e) {
		return null
	}
	
}