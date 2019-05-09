import Vue from 'vue'
import Vuex from 'vuex'
import set from './set'

import user from './user'
import constText from './constText'

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
    user, constText
  }
})