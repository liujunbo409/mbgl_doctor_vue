// 实例方法
import Vue from 'vue'
import axios from 'axios'

Vue.prototype.$toView = function(name){
  this.$router.push({ name })
}

