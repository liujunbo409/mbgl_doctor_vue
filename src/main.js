// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

// 官方库
import Vue from 'vue'
import FastClick from 'fastclick'

// 配置对象
import App from './App'
import router from './router'
import store from './store'
import globalVars from './config/globalVars'
import created from './config/created'

// 立即执行文件
import './config/methods.js'
import './config/request.js'

// 全局组件及插件
import { 
  ToastPlugin, AlertPlugin, ConfirmPlugin, 
  Group, Cell,
} from 'vux'
import VueHeader from '@c/header/Header'

Vue.use(ToastPlugin, { type: 'text' })
Vue.use(AlertPlugin, { title: '提示' })
Vue.use(ConfirmPlugin, { title: '提示' })
Vue.component('vux-group', Group)
Vue.component('vux-cell', Cell)
Vue.component('vue-header', VueHeader)

// 全局变量
Vue._GLOBAL = globalVars          // 全局变量，这里的全局变量不应更改
window.Vue = Vue
window._GLOBAL = {}               // 全局变量，可以进行更改
Vue.prototype.$bus = new Vue()    // 主要用于绑定自定义事件及触发相应事件


FastClick.attach(document.body)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  router, store,
  created,
  render: h => h(App)
}).$mount('#app-box')
