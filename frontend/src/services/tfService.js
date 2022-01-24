import axios from 'axios'
import config from '../../public/config'

export default {
  getNodes (gridVersion, network) {
    console.log(process.env)
    return axios.get(`${config.apiURL}/nodes?grid=${gridVersion}&network=${network}`)
  },
  getFarms (gridVersion, network) {
    return axios.get(`${config.apiURL}/farms?grid=${gridVersion}&network=${network}`)
  },
  getGateways (gridVersion, network) {
    return axios.get(`${config.apiURL}/gateways?grid=${gridVersion}&network=${network}`)
  },
  getStats (gridVersion, network) {
    return axios.get(`${config.apiURL}/stats?grid=${gridVersion}&network=${network}`)
  },
  getPrices (gridVersion, network) {
    return axios.get(`${config.apiURL}/prices?grid=${gridVersion}&network=${network}`)
  }
}
