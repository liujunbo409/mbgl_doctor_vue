import Vue from 'vue'
import Vuex from 'vuex'
import set from './set'

import user from './user'     // 保存用户相关数据
import constText from './constText'   // 常量数据，带缓存（获取一次后再次获取直接返回之前获取的数据）
import hospList from './hospList'     // 医院列表
import baseIllList from './baseIllList'   // 基础疾病列表

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