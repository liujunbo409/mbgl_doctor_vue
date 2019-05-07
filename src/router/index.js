import Vue from 'vue'
import Router from 'vue-router'
import guard from './guard'

import Loading from '@v/sub/Loading'
import _Error from '@v/sub/Error'

import Home from '@v/Home/Home'
import Login from '@v/Login/Login'
import Register from '@v/Login/Register'

import localStorage from '@u/localStorage'

Vue.use(Router)

// 懒加载路由
function load(component){
  return () => ({
    component,
    loading: Loading,
    error: _Error,
    delay: 200,
    timeout: 7000
  })
}

const ResetPassword = load(import('@v/Login/Reset'))
const My = load(import('@v/My/Index'))
const My_Info = load(import('@v/My/Info'))

// 设置路由path和name
function p(name, path){
  return {
    path: `/${path ? path : name}`,
    name,
    meta: {}  // 防止未设置meta造成取到undefined的情况
  }
}

var routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {}
  }, {
    ...p('login'),
    component: Login
  }, {
    ...p('register'),
    component: Register
  }, {
    ...p('reset_psd'),
    component: ResetPassword
  }, {
    ...p('my'),
    component: My
  }, {
    ...p('myInfo', 'my/info'),
    component: My_Info
  }
]

// guard为路由实例添加全局守卫
export default guard(new Router({
  mode: 'history',
  routes
}))
