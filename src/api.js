import log4js from 'log4js'
import Axios from 'axios';

let logger = log4js.getLogger('geohash');
logger.level = process.env.DEBUG_LEVEL;

const API_URL = 'http://ip-api.com/json/'

/**
 *
 * Memoization to prevent API Calls for the same IP
 * @type {Object.<string, APIResponse>}
 */
const clients = {};

/**
 * @typedef APIResponse
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
 *
 * @param {string} ip
 * @returns {Promise<APIResponse>}
 */
async function retrieveLocationFromAPI(ip) {

    const {data, status, statusText} = await Axios.get(`${API_URL}/${ip}`)
    if(!data || status !== 200 || data.status !== 'success') {
        logger.error(`Unsuccessful request (${status}): ${statusText}`, data)
        throw new Error(`Unsuccessful request (${status}): ${data}`)
    }

    logger.debug('Received data from API', data)

    // Sometimes the API returns empty values
    // defaulting every empty string to 'none'
    // see https://github.com/acouvreur/ssh-log-to-influx/issues/35
    for(const key in data) {
        if(data[key] === '') {
            data[key] = 'none'
        }
    }

    return data
}


/**
 * @param {string} ip
 * @returns {Promise<APIResponse>}
 */
async function doApiCall(ip) {

	// Memoization, prevent API call for the same IP
	if(clients[ip]) {
		logger.debug(`Not making an API Call for ${ip}, using in memory from previous calls`, clients[ip])
		return clients[ip]
	}

	try {
		const data = await retrieveLocationFromAPI(ip)
		clients[ip] = data
		return data
	} catch(e) {
        logger.error(e);
		return null
	}

}

export default doApiCall
export { clients }
