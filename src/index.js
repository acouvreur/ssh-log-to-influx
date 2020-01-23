import parser from './parser'
import geohash from './geohash'
import Influx from 'influx'
import log4js from 'log4js'
import net from 'net';

let logger = log4js.getLogger();
logger.level = 'debug';

// InfluxDB Initialization.
const influx = new Influx.InfluxDB({
	host: process.env.INFLUX_URL,
	database: process.env.INFLUX_DB
});

const port = process.env.PORT || 7070;
const host = '0.0.0.0';

const server = net.createServer();

server.on('connection', (socket) => {

	logger.info(`CONNECTED: ${socket.remoteAddress}:${socket.remotePort}`)

	socket.on('data', async (data) => {
		logger.debug('Received data', data.toString())

		const {ip, port, username} = parser(data.toString())
		logger.debug(`Parsed ${username} ${ip}:${port}`)

		const geohashed = await geohash(ip);
		influx.writePoints([
			{
				measurement: 'geossh',
				fields: {
					value: 1
				},
				tags: {
					geohash: geohashed,
					username: username,
					port: port,
					ip: ip
				}
			}
		]);
	})

	socket.on('close', () => {
		logger.info(`CLOSED: ${socket.remoteAddress}:${socket.remotePort}`)
	});
});

server.listen(port, host, () => {
	logger.info(`TCP Server is running on port ${port}.`);
});