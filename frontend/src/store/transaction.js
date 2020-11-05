import tfService from '../services/tfService'

const getDefaultState = () => {
  return {
    user: {},
    nodePage: 1,
    nodesLoading: true,
    nodes: [],
    gateways: [],
    registeredFarms: [],
    gatewaySpecs: {
      amountRegisteredGateways: 0,
      onlineGateways: 0
    },
    farmSpecs: {
      amountregisteredFarms: 0
    },
    nodeSpecs: {}
  }
}

export default ({
  state: getDefaultState(),
  actions: {
    getName: async context => {
      var response = await tfService.getName()
      return response.data.name
    },
    getUser: async context => {
      var name = await context.dispatch('getName')
      var response = await tfService.getUser(name)
      context.commit('setUser', response.data)
    },
    getNodes (context, network) {
      tfService.getNodes(network)
        .then(res => {
          context.commit('setNodes', res.data)
          context.commit('setNodesLoading', false)
        })
    },
    getFarms (context, network) {
      tfService.getFarms(network)
        .then(res => {
          context.commit('setRegisteredFarms', res.data)
          context.commit('setFarmsLoading', false)
          context.commit('setAmountOfFarms', res.data.length)
        })
    },
    getGateways (context, network) {
      tfService.getGateways(network)
        .then(res => {
          context.commit('setRegisteredGateways', res.data)
          context.commit('setGatewaysLoading', false)
          context.commit('setGatewaySpecs', res.data)
        })
    },
    getStats (context, network) {
      tfService.getStats(network)
        .then(res => {
          context.commit('setNodeSpecs', res.data)
        })
    },
    resetState: context => {
      context.commit('resetState')
    },
    refreshData: ({ dispatch }, network) => {
      // reset the vuex store
      dispatch('resetState')

      dispatch('getStats', network)
      dispatch('getNodes', network)
      dispatch('getFarms', network)
      dispatch('getGateways', network)
    }
  },
  mutations: {
    setNodes (state, nodes) {
      state.nodes = nodes
    },
    setNodesLoading (state, loading) {
      state.nodesLoading = loading
    },
    setRegisteredFarms (state, farms) {
      state.registeredFarms = farms
    },
    setFarmsLoading (state, loading) {
      state.farmsLoading = loading
    },
    setRegisteredGateways (state, gateways) {
      state.gateways = gateways
    },
    setGatewaysLoading (state, loading) {
      state.gatewaysLoading = loading
    },
    setFarms (state, value) {
      state.farms = value
    },
    setUser: (state, user) => {
      state.user = user
    },
    setAmountOfFarms (state, value) {
      state.farmSpecs.amountregisteredFarms = value
    },
    setNodeSpecs (state, value) {
      state.nodeSpecs = value
    },
    setGatewaySpecs (state, gateways) {
      if (gateways.length === 0) {
        return
      }
      var onlineGateways = gateways.filter(online)
      state.gatewaySpecs.amountRegisteredGateways += gateways.length
      state.gatewaySpecs.onlineGateways += onlineGateways.length
    },
    resetState (state) {
      // Merge rather than replace so we don't lose observers
      // https://github.com/vuejs/vuex/issues/1118
      Object.assign(state, getDefaultState())
    }
  },
  getters: {
    user: state => state.user,
    nodes: state => state.nodes,
    registeredFarms: state => state.registeredFarms,
    gateways: state => state.gateways,
    nodeSpecs: state => state.nodeSpecs,
    gatewaySpecs: state => state.gatewaySpecs,
    farmSpecs: state => state.farmSpecs,
    nodesLoading: state => state.nodesLoading,
    farmsLoading: state => state.farmsLoading,
    gatewaysLoading: state => state.gatewaysLoading
  }
})

function online (node) {
  const timestamp = new Date().getTime() / 1000
  const minutes = (timestamp - node.updated) / 60
  return minutes < 20
}
