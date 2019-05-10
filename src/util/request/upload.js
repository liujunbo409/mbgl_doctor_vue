import * as qiniu from 'qiniu-js'

export default function(file){
  return new Promise((resolve, reject) =>{
    _request({
      baseURL: Vue._GLOBAL.comApi,
      url: 'uploadToken'
    })
    .then(({data: {ret: token}}) =>{
      var key = 'image/' + new Date().getTime() + file.name
      var obs = qiniu.upload(file, key, token)
      var cb = {
        complete: resolve,
        error: reject
      }
      obs.subscribe(cb)
    })
  })
}