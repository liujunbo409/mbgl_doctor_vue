export default {
  namespaced: true,

  state: {
    doctor: '',
    nurse: ''
  },

  mutations: {
    writeState (state, payload){
      for(let key in payload){
        state[key] = payload[key]
      }
    }
  },

  actions: {
    get (store, payload){
      _request({
        url: 'apply/shenheStatus'
      }).then(({data}) =>{
        if(data.result){
          store.commit('writeState', {
            doctor: data.ret.doctor_status_str,
            nurse: data.ret.nurse_status_str
          })
        }
      })
    }
  }
}