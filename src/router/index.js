import Vue from 'vue'
import Router from 'vue-router'
import guard from './guard'

import Loading from '@v/sub/Loading'
import _Error from '@v/sub/Error'

import Home from '@v/Home/Home'
import Login from '@v/Login/Login'
import Register from '@v/Login/Register'


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
  sub: {
    BeforeCheckPsd: load(import('@v/sub/BeforeCheckPsd'))
  },
  My: {
    Index: load(import('@v/My/Index')),
    Info: load(import('@v/My/Info')),
    Account: {
      Index: load(import('@v/My/Account/Index')),
      ChangePsd: load(import('@v/My/Account/ChangePsd')),
      ChangePhone: load(import('@v/My/Account/ChangePhone')),
    },
    Role: {
      sub: {
        Jxjb: load(import('@v/My/Role/sub/Jxjb'))
      },
      Index: load(import('@v/My/Role/Index')),
      Doctor: load(import('@v/My/Role/Doctor')),
      Nurse: load(import('@v/My/Role/Nurse')),
    },
    Feedback: load(import('@v/My/Feedback'))
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
    ...p('sub/before_check_psd'),
    component: r.sub.BeforeCheckPsd
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
    ...p('my/account/change_psd'),
    component: r.My.Account.ChangePsd
  }, {
    ...p('my/account/change_phone'),
    component: r.My.Account.ChangePhone
  }, {
    ...p('my/role'),
    component: r.My.Role.Index
  }, {
    ...p('my/role/sub/jxjb'),
    component: r.My.Role.sub.Jxjb
  }, {
    ...p('my/role/doctor'),
    component: r.My.Role.Doctor,
    meta: {
      keepAlive: true
    }
  }, {
    ...p('my/role/nurse'),
    component: r.My.Role.Nurse
  }, {
    ...p('my/feedback'),
    component: r.My.Feedback
  }
]

// guard为路由实例添加全局守卫
export default guard(new Router({
  mode: 'history',
  routes
}))
