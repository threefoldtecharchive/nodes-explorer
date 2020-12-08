const axios = require('axios')

const config = require('../config')

async function getPrices (type, network) {
  return axios.get(`${config.testnet}/api/v1/${type}`)
}

module.exports = {
  getPrices
}
