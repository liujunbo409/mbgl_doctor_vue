// 在挂在实例前执行（比beforeCreate还要前）

import localStorage from '@u/localStorage'

var userInfo = localStorage.get('userInfo', null)

export default function(main){
  // 在无登录状态的情况下保存原始访问页
  if(!userInfo){
    localStorage.set('originalTargetUrl', location.href)
  }

  // 在使用openid免登陆的情况下判断是否填写过个人信息
  if(userInfo){
    var {role} = userInfo
    Promise.all([
      _request({
        url: 'my/getMokuaiStatus',
        params: {
          user_id: userInfo.id
        }
      }).then(({data}) =>{
        if(data.result){
          if(data.ret.info){
            localStorage.set('isInfoEdited', true)
          }
        }
      }),

      _request({
        url: 'my/getMokuaiStatus',
        params: {
          role
        }
      }).then(({data}) =>{
        if(data.result){
          window._GLOBAL.accessData = data.result
        }
      })

    ]).then(main).catch(e =>{
      console.log(e)
      main()
    })

  }else{ main() }
}