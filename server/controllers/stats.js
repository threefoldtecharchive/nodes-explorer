const { sumBy, uniqBy } = require('lodash')
const axios = require('axios')
const config = require('../config')

const log = require('pino')()

function getNodes(network) {
  const networks =
    network === "all" ? ["mainnet", "testnet", "devnet"] : [network];
  return Promise.all(
    networks.map((network) => {
      return new Promise((res) => {
        axios
          .get(`${config[`grid3${network}`]}/nodes?max_result=999999999`)
          .then(res)
          .catch((err) => {
            log.warn(err);
            res([]);
          });
      });
    })
  )
    .then((results) => {
      for (let i = 0; i < results.length; i++) {
        results[i] = results[i].data;
      }
      return [].concat(...results)
    })
    .catch((err) => {
      log.warn(err);
      return [];
    });
}

function computeNodeStats(nodes) {
  const onlineNodes = nodes.filter(online)

  const nodeSpecs = {}
  nodeSpecs.amountregisteredNodes = nodes.length
  nodeSpecs.onlinenodes = onlineNodes.length
  nodeSpecs.countries = uniqBy(nodes, node => node.location.country).length
  nodeSpecs.cru = sumBy(onlineNodes, node => node.total_resources.cru)
  nodeSpecs.mru = sumBy(onlineNodes, node => node.total_resources.mru)
  nodeSpecs.sru = sumBy(onlineNodes, node => node.total_resources.sru)
  nodeSpecs.hru = sumBy(onlineNodes, node => node.total_resources.hru)
  nodeSpecs.network = sumBy(onlineNodes, node => node.workloads.network)
  nodeSpecs.volume = sumBy(onlineNodes, node => node.workloads.volume)
  nodeSpecs.container = sumBy(onlineNodes, node => node.workloads.container)
  nodeSpecs.zdb_namespace = sumBy(onlineNodes, node => node.workloads.zdb_namespace)
  nodeSpecs.k8s_vm = sumBy(onlineNodes, node => node.workloads.k8s_vm)

  return nodeSpecs
}

async function appendV3NodeStats(nodeSpecs, network) {
  // get the grid3 nodes
  try {
    const nodes = await getNodes(network)
    const onlineNodes = nodes.filter(v3Online)
    
    nodeSpecs.amountregisteredNodes += nodes.length
    nodeSpecs.onlinenodes += onlineNodes.length
    nodeSpecs.cru += sumBy(onlineNodes, node => +node.cru)
    nodeSpecs.mru += sumBy(onlineNodes, node => Math.ceil(+node.mru/(1024*1024*1024)))
    nodeSpecs.sru += sumBy(onlineNodes, node => Math.ceil(+node.sru/(1024*1024*1024)))
    nodeSpecs.hru += sumBy(onlineNodes, node => Math.ceil(+node.hru/(1024*1024*1024)))

    return nodeSpecs
  } catch (error) {
    log.warn(error)
  }  
}

function online(node) {
  const { reserved } = node
  if (reserved) return true

  const timestamp = new Date().getTime() / 1000
  const minutes = (timestamp - node.updated) / 60
  return minutes < 20
}

function v3Online(node) {
  const status = node? node.status : "down"
  return status.toLowerCase() === 'up'
}

module.exports = {
  computeNodeStats,
  appendV3NodeStats
}
