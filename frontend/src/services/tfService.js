import axios from 'axios'
import config from '../../public/config'

export default {
  getNodes (network) {
    console.log(process.env)
    return axios.get(`${config.apiURL}/nodes?network=${network}`)
  },
  getFarms (network) {
    return axios.get(`${config.apiURL}/farms?network=${network}`)
  },
  getGateways (network) {
    return axios.get(`${config.apiURL}/gateways?network=${network}`)
  },
  getStats (network) {
    return axios.get(`${config.apiURL}/stats?network=${network}`)
  },
  getPrices (network) {
    return axios.get(`${config.apiURL}/prices?network=${network}`)
  }
}
