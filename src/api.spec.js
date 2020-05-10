import doApiCall, {clients} from "./api"
import Axios from "axios"

jest.mock('axios')

const APIData = {"status":"success","country":"United States","countryCode":"US","region":"NC","regionName":"North Carolina","city":"Charlotte","zip":"28202","lat":35.2316,"lon":-80.8428,"timezone":"America/New_York","isp":"Arachnitec","org":"Hostigation","as":"AS20150 anyNode","query":"206.253.167.10"}
const APIDataWithEmptyValue = {"status":"success","country":"","countryCode":"US","region":"NC","regionName":"North Carolina","city":"Charlotte","zip":"28202","lat":35.2316,"lon":-80.8428,"timezone":"America/New_York","isp":"Arachnitec","org":"Hostigation","as":"AS20150 anyNode","query":"206.253.167.10"}

beforeEach(() => {
    delete clients['206.253.167.10']
    jest.clearAllMocks();
    jest.spyOn(Axios, 'get').mockImplementation(() => {
        return Promise.resolve({
            status: 200,
            data: APIData
        })
    })
})

describe('an API call', () => {

    it('should return raw data', async () => {
        const result = await doApiCall('206.253.167.10')
        expect(result).toEqual(APIData)
    })

    it('should store the result for reuse after first call', async () => {
        await doApiCall('206.253.167.10')
        await doApiCall('206.253.167.10')
        expect(Axios.get).toHaveBeenCalledTimes(1)
    })

    it('should replace empty values with \'none\'', async () => {
        jest.spyOn(Axios, 'get').mockImplementation(() => {
            return Promise.resolve({
                status: 200,
                data: APIDataWithEmptyValue
            })
        })

        const result = await doApiCall('206.253.167.10')
        expect(result).toEqual({...APIData, country: 'none'})
    })
})