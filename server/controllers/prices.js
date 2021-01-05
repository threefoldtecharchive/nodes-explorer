const axios = require('axios')

const config = require('../config')

async function getPrices (type, network) {
  if (network === 'testnet') {
    return axios.get(`${config.testnet}/api/v1/${type}`)
  } else if (network === 'devnet') {
    return axios.get(`${config.devnet}/api/v1/${type}`)
  }
  return axios.get(`${config.mainnet}/api/v1/${type}`)
}

module.exports = {
  getPrices
}
