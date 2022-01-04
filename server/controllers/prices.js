const axios = require("axios");

const config = require("../config");

async function getPrices(type, network) {
  // TODO: Get prices from the explorer API for grid3
  if (network === "testnet") {
    return axios.get(`${config.grid2.testnet}/api/v1/${type}`);
  } else if (network === "devnet") {
    return axios.get(`${config.grid2.devnet}/api/v1/${type}`);
  }
  return axios.get(`${config.grid2.mainnet}/api/v1/${type}`);
}

module.exports = {
  getPrices,
};
