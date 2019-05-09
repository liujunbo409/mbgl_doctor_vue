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

const r = {
  ResetPassword: load(import('@v/Login/Reset')),
  My: {
    Index: load(import('@v/My/Index')),
    Info: load(import('@v/My/Info')),
    Account: {
      Index: load(import('@v/My/Account/Index')),
      ChangePsd: {
        BeforeCheck: load(import('@v/My/Account/ChangePsd/BeforeCheck')),
        Change: load(import('@v/My/Account/ChangePsd/Change'))
      },
      ChangePhone: load(import('@v/My/Account/ChangePhone')),
    },
    Role: {
      Index: load(import('@v/My/Role/Index'))
    }
  },
}



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
    component: r.ResetPassword
  }, {
    ...p('my'),
    component: r.My.Index
  }, {
    ...p('my/info'),
    component: r.My.Info
  }, {
    ...p('my/account'),
    component: r.My.Account.Index
  }, {
    ...p('my/account/change_psd/before_check'),
    component: r.My.Account.ChangePsd.BeforeCheck
  }, {
    ...p('my/account/change_psd/change'),
    component: r.My.Account.ChangePsd.Change
  }, {
    ...p('my/account/change_phone'),
    component: r.My.Account.ChangePhone
  }, {
    ...p('my/role'),
    component: r.My.Role.Index
  }
]

// guard为路由实例添加全局守卫
export default guard(new Router({
  mode: 'history',
  routes
}))
