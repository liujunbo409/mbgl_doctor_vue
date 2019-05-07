import localStorage from '@u/localStorage'

export default {
  namespaced: true,

  // 先取本地状态，当完全加载完毕后再进行一次检测登录状态是否有效
  state: {
    isLogin: localStorage.get('isLogin', false),
    openId: window.localStorage.getItem('fwh_openid') || null,
    phoneNum: localStorage.get('phoneNum', ''),
    userInfo: localStorage.get('userInfo', null),
  },

  mutations: {
    // 写状态，改变state中的三个属性的值
    writeState (state, payload){
      state.isLogin = true
      state.phoneNum = payload.phonenum
      state.userInfo = payload
      localStorage.set('isLogin', true)
      localStorage.set('phoneNum', payload.phonenum)
      localStorage.set('userInfo', payload)
    },

    // 清除状态，相当于登出
    clear (state){
      state.isLogin = false,
      state.userInfo = null
      localStorage.set('isLogin', false)
      localStorage.remove('userInfo')
    }
  },

  actions: {
    login (store, payload){
      var {state} = store
      return new Promise((resolve, reject) =>{
        var {phoneNum: phonenum, password} = payload
        // 防止传入的类型为数字
        phonenum = phonenum.toString()
        password = password.toString()
        _request({
          url: 'login/login',
          method: 'post',
          data: {
            phonenum, password,
            fwh_openid: state.openId
          }
        })
        .then(({data}) =>{
          return data.result ? resolve(data) : reject(data)
        }).catch((e) =>{
          console.log(e)
          // 因为下面没有catch，这里直接退出
          return reject({ result: false, type: 'timeout' })
        })
      })
      .then(data =>{
        return new Promise((resolve, reject) =>{
          // 判断帐号是否被禁用
          _request({
            url: 'my/userStatus',
            params: {
              user_id: data.ret.id
            }
          })
          .then(({data: {result}}) =>{
            if(result){
              resolve(data)
            }else{
              reject({ result: false, type: 'ban' })
            }
          })
        })
      })
      .then(data =>{
        return new Promise((resolve, reject) =>{
          store.commit('writeState', data.ret)
          resolve(data)      
        })
      })
    },

    register (store, payload){
      var {state} = store
      payload.fwh_openid = state.openId

      return new Promise((resolve, reject) =>{
        _request({
          method: 'post',
          url: 'login/register',
          data: payload
        }).then(({data}) =>{
          if(data.result){
            // 注册成功后直接写入登录状态
            store.commit('writeState', data.ret)
            resolve()
          }else{
            reject(data)
          }
        }).catch((e) =>{
          console.log(e)
          reject({ timeout: true })
        })  
      })
    },

    resetPsd (store, payload){
      var {state} = store
      payload.fwh_openid = state.openId
      
      return new Promise((resolve, reject) =>{
        _request({
          url: 'login/forgetPWD',
          method: 'post',
          data: payload
        }).then(({data}) =>{
          if(data.result){
            store.commit('writeState', data.ret)
            resolve()
          }else{
            reject(data)
          }
        }).catch((e) =>{
          console.log(e)
          reject({ timeout: true })
        })
      })
    }
  }
}