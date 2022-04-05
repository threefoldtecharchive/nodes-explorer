<template>
  <v-app dark>
    <v-toolbar class='toolbar' dark>
      <v-app-bar-nav-icon>
        <v-img class='logo' src='./assets/3fold_icon.png' />
      </v-app-bar-nav-icon>
      <v-toolbar-title>ThreeFold Capacity Explorer</v-toolbar-title>
    </v-toolbar>

    <v-toolbar class="toolbar" color="red">
      <v-toolbar-title class="white--text flex">Make sure to migrate your nodes to <a target="_blank" href="https://forum.threefold.io/t/farming-migration-grid-v2-v3/2143" class="text-white">TF Grid v3</a> before May 1st 2022. <a target="_blank" href="https://explorer.grid.tf/" class="text-white">The v2 explorer</a> will no longer be supported after that date.</v-toolbar-title>
    </v-toolbar>

    <v-content class='content'>
      <v-col>
        <v-row class='actions pa-4'>
          <div class='dropdown'>
            <v-select
              v-model='grid'
              :items='gridVersions'
              item-text='text'
              label='Grid Version'
              persistent-hint
              return-object
              outlined
              dense
              @change='onUpdateGrid'
            ></v-select>
          </div>
          <div class='dropdown'>
            <v-select
              v-model='select'
              :items='items'
              class='ml-4'
              item-text='text'
              label='Network'
              persistent-hint
              return-object
              outlined
              dense
              @change='refreshWithNetwork'
            ></v-select>
          </div>
          <v-spacer />
          <div class="grid3label">
            <v-btn-toggle
              rounded
            >
              <v-btn
              class='grid3'
              color='primary'
              dark
              small
              outlined
              href="https://portal.grid.tf"
              target="_blank"
            >
              <v-icon>mdi-link</v-icon>
              <span class='ml-2'>Mainnet Portal</span>
            </v-btn>
            <v-btn
              class='grid3'
              color='primary'
              dark
              small
              outlined
              href="https://portal.test.grid.tf"
              target="_blank"
            >
              <v-icon>mdi-link</v-icon>
              <span class='ml-2'>Testnet Portal</span>
            </v-btn>
            </v-btn-toggle>
          </div>
          <v-progress-circular
            class='refresh'
            v-if='nodesLoading || farmsLoading || gatewaysLoading'
            indeterminate
            color='primary'
          ></v-progress-circular>
          <v-btn class='refresh' icon v-else @click='refreshWithNetwork'>
            <v-icon big color='primary' left> fas fa-sync-alt </v-icon>
          </v-btn>
        </v-row>
        <router-view :grid="grid.text"></router-view>
      </v-col>
    </v-content>
  </v-app>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'App',
  components: {},
  data: () => ({
    showDialog: false,
    dilogTitle: 'title',
    dialogBody: '',
    dialogActions: [],
    dialogImage: null,
    block: null,
    showBadge: true,
    menu: false,
    start: undefined,
    refreshInterval: undefined,
    toggle_exclusive: undefined,
    select: { key: 'all', text: 'all' },
    grid: { key: 'all', text: 'grid2 & grid3' },
    gridVersions: [{ key: 'all', text: 'Grid V2 & Grid V3' }, { key: 'grid3', text: 'Grid V3' }, { key: 'grid2', text: 'Grid V2' }],
    items: [{ key: 'all', text: 'All' }, { key: 'mainnet', text: 'Mainnet' }, { key: 'testnet', text: 'Testnet' }, { key: 'devnet', text: 'Devnet' }]
  }),
  computed: {
    routes () {
      return this.$router.options.routes
    },
    ...mapGetters(['nodesLoading', 'farmsLoading', 'gatewaysLoading'])
  },
  mounted () {
    this.refreshWithNetwork()
  },
  methods: {
    ...mapActions({
      refresh: 'refreshData'
    }),
    onUpdateGrid () {
      const gridType = this.grid.key
      if (gridType === 'grid3') {
        this.items = [{ key: 'all', text: 'All' }, { key: 'mainnet', text: 'Mainnet' }, { key: 'testnet', text: 'Testnet' }, { key: 'devnet', text: 'Devnet' }]
      } else if (gridType === 'grid2') {
        this.items = [
          { key: 'all', text: 'All' },
          { key: 'mainnet', text: 'Mainnet' },
          { key: 'testnet', text: 'Testnet' }
        ]
      } else {
        this.items = [
          { key: 'all', text: 'All' },
          { key: 'mainnet', text: 'Mainnet' },
          { key: 'testnet', text: 'Testnet' },
          { key: 'devnet', text: 'Devnet' }
        ]
      }
      this.select = this.items[0]
      this.refreshWithNetwork()
    },
    refreshWithNetwork () {
      this.$router.history.push(this.select.key)
      this.refresh({ grid: this.grid.key, network: this.select.key })
    }
  }
}
</script>

<style lang='scss'>
.actions {
  height: 60px;
}
.logo {
  width: 40px;
  height: 40px;
  margin-left: 10px;
  margin-bottom: 3px;
}
.toolbar {
  background-color: #2d4052 !important;
  max-height: 60px;
}
.dropdown {
  width: 300px !important;
}
.refresh {
  position: absolute !important;
  right: 25px !important;
  top: 30px !important;
  font-size: 30px !important;
}
.grid3label {
  margin-top: 5px;
  margin-right: 60px;
}
</style>
