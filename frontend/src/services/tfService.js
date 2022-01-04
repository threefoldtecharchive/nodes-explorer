import axios from 'axios'
import config from '../../public/config'

export default {
  getNodes (gridVeriosn, network) {
    console.log(process.env)
    return axios.get(`${config.apiURL}/nodes?grid=${gridVeriosn}&network=${network}`)
  },
  getFarms (gridVeriosn, network) {
    return axios.get(`${config.apiURL}/farms?grid=${gridVeriosn}&network=${network}`)
  },
  getGateways (gridVeriosn, network) {
    return axios.get(`${config.apiURL}/gateways?grid=${gridVeriosn}&network=${network}`)
  },
  getStats (gridVeriosn, network) {
    return axios.get(`${config.apiURL}/stats?grid=${gridVeriosn}&network=${network}`)
  },
  getPrices (gridVeriosn, network) {
    return axios.get(`${config.apiURL}/prices?grid=${gridVeriosn}&network=${network}`)
  }
}
