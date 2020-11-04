import axios from 'axios'
import config from '../../public/config'

export default {
  getNodes (size, page) {
    const nodes = config.tfApiUrls.map(url => {
      return axios.get(`${url}/nodes`, {
        params: {
          size,
          page
        }
      })
    })
    return Promise.all(nodes)
  },
  registeredfarms (size, page) {
    const farms = config.tfApiUrls.map(url => {
      return axios.get(`${url}/farms`, {
        params: {
          size,
          page
        }
      })
    })
    return Promise.all(farms)
  },
  getGateways (size, page) {
    const gateways = config.tfApiUrls.map(url => {
      return axios.get(`${url}/gateways`, {
        params: {
          size,
          page
        }
      })
    })
    return Promise.all(gateways)
  }
}
