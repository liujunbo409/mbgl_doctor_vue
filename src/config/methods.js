// 实例方法
import Vue from 'vue'

Vue.prototype.$toView = function(name, options = {}){
  this.$router.push({ name, ...options })
};


Vue.prototype.$queryToView = function(path, query = {}){
  this.$router.push({ path, ...query })
};
