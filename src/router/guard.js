// 全局路由守卫
import localStorage from '@u/localStorage'

export default function(router){
  router.beforeEach((to, from, next) =>{
    if(!localStorage.get('isLogin', false) && to.name !== 'login'){
      next({ name: 'login' })
    }
    next()
  })

  router.beforeEach((to, from, next) =>{
    if(['login', 'register', 'reset_psd'].includes(to.name)){
      if(localStorage.get('isLogin', false)){
        next({ name: 'home' })
      }
    }
    next()
  })

  return router
}