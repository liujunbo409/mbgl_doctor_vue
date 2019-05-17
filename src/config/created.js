// 根实例的created

import localStorage from '@u/localStorage'

export default function(){
  // 如果标记为已登录，尝试判断登录状态是否有效以及账户是否被禁用，若有效更新userInfo，无效跳转login
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

    // 初始化医院数据
    this.$store.dispatch('hospList/load')

    // 获取填写状态
    this.$store.dispatch('user/editStatus/get')
  }

  
  // 获取基本疾病列表
  this.$store.dispatch('baseIllList/load')
}