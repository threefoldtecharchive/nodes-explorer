const { sumBy, uniqBy } = require("lodash");
const axios = require("axios");
const config = require("../config");

function computeNodeStats(nodes) {
  const onlineNodes = nodes.filter(online);

  // converting the v3 bytes to GB
  function getValue(x, nodeURL) {
    if (nodeURL.includes("gridproxy")) {
      return x / (1024 * 1024 * 1024);
    } else {
      return x
    }
  }

  const nodeSpecs = {};
  nodeSpecs.amountregisteredNodes = nodes.length;
  nodeSpecs.onlinenodes = onlineNodes.length;
  nodeSpecs.countries = uniqBy(nodes, (node) => node.location.country).length;
  nodeSpecs.cru = sumBy(onlineNodes, (node) => node.total_resources.cru);
  nodeSpecs.mru = sumBy(onlineNodes, (node) => getValue(node.total_resources.mru, node.url));
  nodeSpecs.sru = sumBy(onlineNodes, (node) => getValue(node.total_resources.sru, node.url));
  nodeSpecs.hru = sumBy(onlineNodes, (node) => getValue(node.total_resources.hru, node.url));

  return nodeSpecs;
}

function online(node) {
  // Grid2 check
  const { reserved } = node;
  if (reserved) return true;

  // Grid3 check
  const { status } = node;
  if (status === "up") return true;

  const timestamp = new Date().getTime() / 1000;
  const minutes = (timestamp - node.updated) / 60;
  return minutes < 20;
}

function v3Online(node) {
  const status = node ? node.status : "down";
  return status.toLowerCase() === "up";
}

module.exports = {
  computeNodeStats,
};
