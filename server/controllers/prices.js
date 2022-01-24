const axios = require("axios");

const config = require("../config");

async function getPrices(type, network) {
    // TODO: Get prices from the explorer API for grid3
    if (network === "testnet") {
        return axios.get(`https://explorer.testnet.grid.tf/api/v1/${type}`);
    } else if (network === "devnet") {
        return axios.get(`https://explorer.testnet.grid.tf/api/v1/${type}`);
    }
    return axios.get(`https://explorer.grid.tf/api/v1/${type}`);
}

module.exports = {
    getPrices,
};