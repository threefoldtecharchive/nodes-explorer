const axios = require('axios')
const config = require('../config')
const { flatten } = require('lodash')

async function getItems (network, type) {
  if (type === 'stats') {
    type = 'nodes'
  }

  const startPage = 1

  const response = await Promise.all(getItemFromExplorer(type, network, 500, startPage))
  const pages = response.map(res => {
    return parseInt(res.headers.pages, 10)
  })
  const itemsPageOne = flatten(response.map(res => {
    return res.data.map(item => {
      return {
        ...item,
        url: res.config.url
      }
    })
  }))

  const promises = []
  pages.forEach(page => {
    for (let index = startPage + 1; index <= page; index++) {
      promises.push(getItemFromExplorer(type, network, 500, index))
    }
  })

  const items = await Promise.all(flatten(promises))
  const mappedItems = flatten(items.map(res => {
    return res.data.map(item => {
      return {
        ...item,
        url: res.config.url
      }
    })
  }))

  return [...mappedItems, ...itemsPageOne]
}

// Type can be nodes / farms / gateways
function getItemFromExplorer (type, network, size, page) {
  return getUrls(network).map(url => {
    return axios.get(`${url}/explorer/${type}`, {
      params: {
        size,
        page
      }
    })
  })
}

function getUrls (network) {
  switch (network) {
    case 'mainnet':
      return [config.mainnet]
    case 'testnet':
      return [config.testnet]
    // case 'devnet':
    //   return [config.devnet]
    case 'all':
      return [config.mainnet, config.testnet]
    default: return [config.mainnet, config.testnet]
  }
}

module.exports = {
  getItems,
  getUrls
}
