// 全局路由守卫
import localStorage from '@u/localStorage'

export default function(router){
  // 未登录跳转到login
  router.beforeEach((to, from, next) =>{
    if(!localStorage.get('isLogin', false) && to.name !== 'login'){
      next({ name: 'login' })
    }
    next()
  })

  // 登录状态下未填信息跳转到信息填写
  router.beforeEach((to, from, next) =>{
    if(
      localStorage.get('isLogin', false) && 
      !localStorage.get('isInfoEdited', false) && 
      to.name !== 'my/info'
    ){
      next({ name: 'my/info' })
    }
    next()
  })

  // 登录后再进入【登录、注册、忘记密码】界面将跳转到home
  router.beforeEach((to, from, next) =>{
    if(['login', 'register', 'reset_psd'].includes(to.name)){
      if(localStorage.get('isLogin', false)){
        next({ name: 'home' })
      }
    }
    next()
  })

  // 每次进入有限制的模块时检测权限
  router.beforeEach((to, from, next) =>{
    if(!/^\/(|login|register|reset_psd|my.*)$/.test(to.path)){
      router.app.$options.store.state.user.access ? next() : next({ name: 'home' })
    }
    next()
  })

  // 带有meta.fromUrlStop的路由，若从url进入(name为null)则跳到home(防止用户从url直接进入需要重要参数数据的页面)
  router.beforeEach((to, from, next) =>{
    if(to.meta.fromUrlStop && from.name === null){
      next({ name: 'home' })
    }
    next()
  })

  return router
}