import Vue from 'vue'
import Vuex from 'vuex'
import set from './set'

import user from './user'
import constText from './constText'
import hospList from './hospList'
import baseIllList from './baseIllList'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {

  },

  mutations: {
    set
  },

  getters: {

  },

  modules: {
    user, constText, hospList, baseIllList
  }
})