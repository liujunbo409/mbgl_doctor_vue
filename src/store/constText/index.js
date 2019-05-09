import axios from 'axios'
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
          axios({
            url: 'http://de.lljiankang.top/api/common/utils',
            timeout: '5000',
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