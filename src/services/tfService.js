import axios from 'axios'
import config from '../../public/config'

export default {
  getNodes (size, page, urlIndex) {
    const nodes = getUrl(urlIndex).map(url => {
      return axios.get(`${url}/nodes`, {
        params: {
          size,
          page
        }
      })
    })
    return Promise.all(nodes)
  },
  registeredfarms (urlIndex) {
    const farms = getUrl(urlIndex).map(url => {
      return axios.get(`${url}/farms`)
    })
    return Promise.all(farms)
  },
  getGateways (urlIndex) {
    const gateways = getUrl(urlIndex).map(url => {
      return axios.get(`${url}/gateways`)
    })
    return Promise.all(gateways)
  }
}
function getUrl (urlIndex) {
  if (urlIndex === undefined) return config.tfApiUrls

  return [config.tfApiUrls[urlIndex]]
}
