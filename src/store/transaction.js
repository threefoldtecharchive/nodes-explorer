import tfService from '../services/tfService'
import { sumBy, uniqBy, flatten } from 'lodash'

const getDefaultState = () => {
  return {
    user: {},
    nodePage: 1,
    nodesLoading: true,
    nodes: [],
    gateways: [],
    registeredFarms: [],
    farms: [],
    gatewaySpecs: {
      amountRegisteredGateways: 0,
      onlineGateways: 0
    },
    nodeSpecs: {
      amountregisteredNodes: 0,
      amountregisteredFarms: 0,
      countries: 0,
      onlinenodes: 0,
      cru: 0,
      mru: 0,
      sru: 0,
      hru: 0,
      network: 0,
      volume: 0,
      container: 0,
      zdb_namespace: 0,
      k8s_vm: 0
    }
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
    getNodes (context, params) {
      let page = context.state.nodePage
      if (!page) return

      const getNodes = (page) => {
        return tfService.getNodes(params.size, page)
      }

      getNodes(page).then(response => {
        const pages = response.map(res => {
          return parseInt(res.headers.pages, 10)
        })
        const nodes = flatten(response.map(res => res.data))
        context.commit('setNodes', nodes)

        const promises = []
        pages.forEach(page => {
          for (let index = context.state.nodePage; index <= page; index++) {
            promises.push(getNodes(index))
          }
        })

        Promise.all(promises)
          .then(res => {
            res.map(response => {
              const nodes = flatten(response.map(res => res.data))
              context.commit('setNodes', nodes)
            })
          })
          .finally(() => {
            context.commit('setTotalSpecs', context.state.nodes)
            context.commit('setNodesLoading', false)
          })
      })
    },
    getRegisteredFarms (context) {
      tfService.registeredfarms().then(response => {
        const farms = flatten(response.map(res => res.data))

        context.commit('setRegisteredFarms', farms)

        context.commit('setAmountOfFarms', farms)
        context.commit('setFarmsLoading', false)
      })
    },
    getRegisteredGateways (context) {
      tfService.getGateways().then(response => {
        const gateways = flatten(response.map(res => res.data))

        context.commit('setRegisteredGateways', gateways)

        context.commit('setGatewaySpecs', gateways)
        context.commit('setGatewaysLoading', false)
      })
    },
    resetState: context => {
      context.commit('resetState')
    },
    refreshData: ({ dispatch }) => {
      // reset the vuex store
      dispatch('resetState')

      dispatch('getNodes', { size: 500, page: 1 })
      dispatch('getRegisteredFarms', { size: 500, page: 1 })
      dispatch('getRegisteredGateways', { size: 500, page: 1 })
    }
  },
  mutations: {
    setNodes (state, nodes) {
      state.nodes = state.nodes.concat(nodes)
      state.nodePage += 1
    },
    setNodesLoading (state, loading) {
      state.nodesLoading = loading
    },
    setRegisteredFarms (state, farms) {
      state.registeredFarms = state.registeredFarms.concat(farms)
    },
    setFarmsLoading (state, loading) {
      state.farmsLoading = loading
    },
    setRegisteredGateways (state, gateways) {
      state.gateways = state.gateways.concat(uniqBy(gateways, 'node_id'))
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
      if (value.length === 0) {
        return
      }
      state.nodeSpecs.amountregisteredFarms += value.length
    },
    setTotalSpecs (state, nodes) {
      console.log(nodes)
      if (nodes.length === 0) {
        return
      }

      const onlineNodes = nodes.filter(online)

      state.nodeSpecs.amountregisteredNodes = nodes.length
      state.nodeSpecs.onlinenodes = onlineNodes.length
      state.nodeSpecs.countries = uniqBy(nodes, node => node.location.country).length
      state.nodeSpecs.cru = sumBy(onlineNodes, node => node.total_resources.cru)
      state.nodeSpecs.mru = sumBy(onlineNodes, node => node.total_resources.mru)
      state.nodeSpecs.sru = sumBy(onlineNodes, node => node.total_resources.sru)
      state.nodeSpecs.hru = sumBy(onlineNodes, node => node.total_resources.hru)
      state.nodeSpecs.network = sumBy(onlineNodes, node => node.workloads.network)
      state.nodeSpecs.volume = sumBy(onlineNodes, node => node.workloads.volume)
      state.nodeSpecs.container = sumBy(onlineNodes, node => node.workloads.container)
      state.nodeSpecs.zdb_namespace = sumBy(onlineNodes, node => node.workloads.zdb_namespace)
      state.nodeSpecs.k8s_vm = sumBy(onlineNodes, node => node.workloads.k8s_vm)
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
    farms: state => state.farms,
    nodeSpecs: state => state.nodeSpecs,
    gatewaySpecs: state => state.gatewaySpecs,
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
