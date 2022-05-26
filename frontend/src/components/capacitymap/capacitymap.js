import capacityselector from '../capacityselector'
import nodeinfo from '../nodeinfo'
import { mapGetters, mapMutations } from 'vuex'
import { groupBy, map } from 'lodash'

export default {
  name: 'capacitymap',
  components: { capacityselector, nodeinfo },
  props: [],
  data () {
    return {
      select: { text: 'All', value: 'All' }
    }
  },
  computed: {
    ...mapGetters(['registeredFarms', 'nodes']),
    allFarmsList: function () {
      const allFarmers = this.registeredFarms.map(farm => {
        return {
          value: farm,
          text: farm.name
        }
      })
      allFarmers.push({ text: 'All', value: 'All' })
      return allFarmers
    },
    nodeLocation: function () {
      // filter only up nodes
      const upNodes = this.nodes.filter(n => n.state.status === 'up')
      // Group nodes by country
      const groupedNodeLocations = groupBy(
        upNodes,
        node => node.location.country
      )

      const nodeLocations = []
      // Map expect type [[country, count], ...]
      map(groupedNodeLocations, (groupedLocation, key) => {
        const numberOfNodesInLocation = []
        const count = groupedLocation.length
        numberOfNodesInLocation.push(key, count)
        nodeLocations.push(numberOfNodesInLocation)
      })

      return nodeLocations
    }
  },
  mounted () { },
  methods: {
    setSelected (value) {
      if (value === 'All') {
        this.$emit('custom-event-input-changed', '')
        return this.setNodes(this.nodes)
      }
      const filteredNodes = this.nodes.filter(
        node => node.farm_id.toString() === value.id.toString()
      )
      this.setNodes(filteredNodes)
      this.$emit('custom-event-input-changed', value.name.toString())
    },
    ...mapMutations(['setNodes'])
  }
}
