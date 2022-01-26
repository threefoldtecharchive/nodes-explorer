export default {
  name: 'nodeinfo',
  props: ['gateway'],
  data () {
    return {
      freeIcon: this.gateway.freeToUse === true ? { icon: 'fa-check', color: 'green' } : { icon: 'fa-times', color: 'red' }
    }
  },
  methods: {
    getPercentage (type) {
      return (this.gateway.reservedResources[type] / this.gateway.totalResources[type]) * 100
    }
  }
}
