import miniGraph from '../../components/minigraph'
import nodesTable from '../../components/nodestable'
import gatewaysTable from '../../components/gatewaystable'
import capacityMap from '../../components/capacitymap'

import scrollablecard from '../../components/scrollablecard'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'capacity',
  components: { miniGraph, capacityMap, nodesTable, scrollablecard, gatewaysTable },
  props: [],
  data () {
    return {
      showDialog: false,
      dilogTitle: 'title',
      dialogBody: '',
      dialogActions: [],
      dialogImage: null,
      block: null,
      showBadge: true,
      menu: false,
      selectedNode: '',
      selectedGateway: ''
    }
  },
  computed: {
    ...mapGetters([
      'nodeSpecs',
      'gatewaySpecs',
      'farmSpecs'
    ])
  },
  mounted () {
    this.refresh('All')
  },
  methods: {
    ...mapActions({
      refresh: 'refreshData'
    }),
    changeSelectedNode (data) {
      this.selectedNode = data
    },
    changeSelectedGateway (data) {
      this.selectedGateway = data
    }
  }
}
