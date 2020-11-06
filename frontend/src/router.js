import Vue from 'vue'
import Router from 'vue-router'
import { publicPath } from '../vue.config'
import Capacity from './views/capacity'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: publicPath,
  routes: [
    {
      path: '/',
      name: 'Capacity directory',
      component: Capacity
    }
  ]
})
