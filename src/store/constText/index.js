export default {
  namespaced: true,

  state: {
    
  },

  mutations: {
    add (state, payload){
      state[Object.keys(payload)[0]] = state[Object.values(payload)[0]]
    }
  },

  actions: {
    get (store, name){
      return new Promise((resolve, reject) =>{
        if(name in store.state){
          resolve(store.state[name])
        }else{
          _request({
            baseURL: Vue._GLOBAL.comApi,
            url: 'utils',
            params: { param: name }
          })
          .then(({data}) =>{
            store.commit('add', { [name]: data.ret })
            resolve(data.ret)
          })
        }
      })
    }
  }
}