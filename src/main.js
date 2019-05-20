// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

// 公共库
import Vue from 'vue'
import FastClick from 'fastclick'
import VideoPlayer from 'vue-video-player';

// 配置对象
import App from './App'
import router from './router'
import store from './store'
import globalVars from './config/globalVars'
import beforeCreate from './config/beforeCreate'
import created from './config/created'

// 全局组件及插件
import { 
  ToastPlugin, AlertPlugin, ConfirmPlugin, LoadingPlugin,
  Group, Cell, ViewBox
} from 'vux'
import VueHeader from '@c/header/Header'

// 导入video-player
require('video.js/dist/video-js.css')
require('vue-video-player/src/custom-theme.css')
Vue.use(VideoPlayer)

Vue.use(ToastPlugin, { type: 'text' })
Vue.use(AlertPlugin, { title: '提示' })
Vue.use(ConfirmPlugin, { title: '提示' })
Vue.use(LoadingPlugin, { text: '请稍候' })
Vue.component('vux-group', Group)
Vue.component('vux-cell', Cell)
Vue.component('vue-header', VueHeader)
Vue.component('view-box', ViewBox)


// 全局变量
Vue._GLOBAL = globalVars          // 全局变量，这里的全局变量不应更改
window.Vue = Vue
window._GLOBAL = {}               // 全局变量，可以进行更改
Vue.prototype.$bus = new Vue()    // 主要用于绑定自定义事件及触发相应事件

// 立即执行文件
require('./config/methods.js')  // 挂载实例方法
require('./config/request.js')  // 挂载请求器

FastClick.attach(document.body)

Vue.config.productionTip = false




/* eslint-disable no-new */
new Vue({
  router, store,
  beforeCreate, created,
  render: h => h(App)
}).$mount('#app-box')
