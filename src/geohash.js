import axios from 'axios'
import ngeohash from 'ngeohash'
import log4js from 'log4js'

let logger = log4js.getLogger('geohash');
logger.level = 'debug';

const API_URL = 'http://ip-api.com/json/'

const instance = axios.create({
    baseURL: API_URL
});



/**
 * 
 * @param {String} ip IP Address, can be IPv4 or IPv6
 */
const geohash = async (ip) => {
    const {latitude, longitude, location} = await retrieveLocationFromAPI(ip);
    return { geohash: ngeohash.encode(latitude, longitude), location}
}

async function retrieveLocationFromAPI(ip) {
    const {data, status, statusText} = await (await instance.get(`/${ip}`))
    if(status !== 200) {
        logger.error(`Unsuccessful request (${status}): ${statusText}`)
    }

    const {lon, lat, regionName, city} = data;
    return {longitude: lon, latitide: lat, location: `${regionName}, ${city}`}
}

export default geohash