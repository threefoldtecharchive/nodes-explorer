const { sumBy, uniqBy } = require('lodash')

function computeNodeStats (nodes) {
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

function online (node) {
  const timestamp = new Date().getTime() / 1000
  const minutes = (timestamp - node.updated) / 60
  return minutes < 20
}

module.exports = {
  computeNodeStats
}
