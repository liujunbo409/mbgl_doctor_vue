export default {
  namespaced: true,

  state: {
    data: []
  },

  mutations: {
    writeStatus (state, payload){
      state.data = payload
    }
  },

  getters: {
    plain: state =>{
      return state.data.map(val =>{
        return { 
          name: val.name,
          id: val.id
        }
      })
    }
  },

  actions: {
    load (store, payload){
      _request({
        baseURL: Vue._GLOBAL.comApi,
        url: 'baseIllList',
        params: {
          role: 'doctor'
        }
      }).then(({data: {ret}}) =>{
        store.commit('writeStatus', ret)
      })
    }
  }
}