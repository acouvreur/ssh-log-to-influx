import axios from 'axios'
import ngeohash from 'ngeohash'

const API_URL = 'http://ip-api.com/json/'

const instance = axios.create({
    baseURL: API_URL
});



/**
 * 
 * @param {String} ip IP Address, can be IPv4 or IPv6
 */
const geohash = async (ip) => {
    const {latitude, longitude} = await retrieveLocationFromAPI(ip);
    return ngeohash.encode(latitude, longitude)
}

async function retrieveLocationFromAPI(ip) {
    const {lon, lat} = await instance.get(`/${ip}`)
    return {longitude: lon, latitide: lat}
}

export default geohash