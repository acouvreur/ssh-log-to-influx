import axios from 'axios'
import log4js from 'log4js'

let logger = log4js.getLogger('geohash');
logger.level = 'debug';

const API_URL = 'http://ip-api.com/json/'

const instance = axios.create({
    baseURL: API_URL
});

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

    const {data, status, statusText} = await instance.get(`/${ip}`)
    if(status !== 200 || data.status !== 'success') {
        logger.error(`Unsuccessful request (${status}): ${statusText}`, data)
        throw new Error(`Unsuccessful request (${status}): ${data}`)
    }

    logger.debug('Received data from API', data)
    return data
}

export default retrieveLocationFromAPI