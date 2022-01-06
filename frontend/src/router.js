import Vue from 'vue'
import Router from 'vue-router'
import { publicPath } from '../vue.config'
import Capacity from './views/capacity'
import NotFound from './views/notFound'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: publicPath,
  routes: [
    {
      path: '/',
      name: 'Capacity directory',
      component: Capacity
    },
    {
      path: '/all',
      name: 'Capacity directory',
      component: Capacity
    },
    {
      path: '/mainnet',
      name: 'Capacity directory',
      component: Capacity
    },
    {
      path: '/testnet',
      name: 'Capacity directory',
      component: Capacity
    },
    // {
    //   path: '/devnet',
    //   name: 'Capacity directory',
    //   component: Capacity
    // },
    {
      path: '*',
      name: 'Not found',
      component: NotFound
    }
  ]
})
