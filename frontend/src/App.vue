<template>
  <v-app dark>
    <v-toolbar class="toolbar" dark>
      <v-app-bar-nav-icon>
        <v-img class="logo" src="./assets/3fold_icon.png" />
      </v-app-bar-nav-icon>
      <v-toolbar-title>ThreeFold capacity explorer</v-toolbar-title>
    </v-toolbar>

    <v-content class="content">
      <v-col>
        <v-row class="pa-4">
          <div class="dropdown">
            <v-select
              v-model="select"
              :items="items"
              item-text="text"
              label="Select"
              persistent-hint
              return-object
              outlined
              dense
              @change="refreshWithNetwork"
            ></v-select>
          </div>
          <v-spacer/>
          <v-progress-circular
            class="refresh"
            v-if="nodesLoading || farmsLoading || gatewaysLoading"
            indeterminate
            color="primary"
          ></v-progress-circular>
          <v-btn class="refresh" icon v-else @click="refreshWithNetwork">
            <v-icon
              big
              color="primary"
              left
            >
              fas fa-sync-alt
            </v-icon>
          </v-btn>
        </v-row>
        <router-view></router-view>
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
    select: { text: 'All' },
    items: [
      { text: 'All' },
      { text: 'Mainnet' },
      { text: 'Testnet' },
      { text: 'Devnet' }
    ]
  }),
  computed: {
    routes () {
      return this.$router.options.routes
    },
    ...mapGetters([
      'nodesLoading',
      'farmsLoading',
      'gatewaysLoading'
    ])
  },
  methods: {
    ...mapActions({
      refresh: 'refreshData'
    }),
    refreshWithNetwork () {
      this.refresh(this.select.text)
    }
  }
}
</script>

<style lang="scss">
.logo {
  width: 50px;
  height: 50px;
  margin-left: 10px;
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
</style>