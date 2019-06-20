// 根实例的created

import localStorage from '@u/localStorage'

export default function(){
  // 如果标记为已登录，尝试判断登录状态是否有效以及账户是否被禁用，无效或被禁用跳转login
  // 如果标记未登录，则检查“user_laravel_id”，如果有效，则用该id获取用户信息，并reload
  var laravelId = window.localStorage.getItem('user_laravel_id', false)

  if(localStorage.get('isLogin', false)){
    _request({
      url: 'my/getByIdWithToken'
    }).then(({data}) =>{
      if(data.code === 105){
        this.$store.commit('user/clear')
        this.$toView('login')
        this.$bus.$emit('vux.toast', {
          text: '您的登录状态似乎已经失效，请重新登录',
          width: '10em',
          position: 'bottom'
        })
      }
      if(data.code === 200){
        _request({
          url: 'my/userStatus',
          params: {
            user_id: data.ret.id
          }
        }).then(({data: {result: noBan}}) =>{
          if(!noBan){
            this.$store.commit('user/clear')
            this.$toView('login')
            this.$bus.$emit('vux.toast', {
              type: 'cancel',
              text: '您的账户已被禁用'
            })
          }else{
            this.$store.commit('user/writeState', data.ret)
          }
        })
      }
    })

    _request({
      url: 'my/inform',
      parmas: {
        role: this.$store.state.user.userInfo.role
      }
    }).then(({data}) =>{
      if(data.result){
        this.$toView('my/role')
        this.$bus.$emit('vux.alert', data.ret)
      }
    }).catch(e =>{
      console.log(e)
    })
  }else if(laravelId){
    // 获取用户信息
    _request({
      url: 'my/getByIdWithToken',
      params: {
        user_id: laravelId
      }
    }).then(({data}) =>{
      if(data.result){
        this.$store.commit('user/writeState', data.ret)
        var originalTargetUrl = localStorage.get('originalTargetUrl', '')
        if(originalTargetUrl){
          window.location.href = originalTargetUrl
        }else{
          window.location.reload()
        }
      }
    }).catch(e =>{
      console.log(e)
    })
  }
  
  // 获取基本疾病列表
  this.$store.dispatch('baseIllList/load')
}