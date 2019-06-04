// 请求器实例，挂载于window._request
import axios from 'axios'
import qs from 'qs'
import localStorage from '@u/localStorage'

var commonConfig = {
  timeout: 5000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  transformRequest: qs.stringify
}

var axiosInstance = axios.create({
  baseURL: Vue._GLOBAL.api,
  ...commonConfig
})
axiosInstance.interceptors.request.use(requestDataHandler)

// 若有token和userid，则自动添加
function requestDataHandler(config){
  var {token, id} = localStorage.get('userInfo', {})

  var target = config.method === 'post' ? 'data' : 'params'
  if(!config[target]){ config[target] = {} }
  if(token){ config[target].token = token }
  if(id){ config[target].user_id = id }

  return config
}

// 字符串数据全部做对应转换
axiosInstance.interceptors.response.use(responseDataHandler)

function responseDataHandler(res){
  function foo(data){
    if(typeof data !== 'object'){
      if(data === 'true'){ return true }
      if(data === 'false'){ return false }  
      if(data === 'null'){ return null }
      if(/^[1-9]\d*$/.test(data)){ return parseInt(data) }
      if(data === '0'){ return 0 }
      return data    
    }else{
      if(data === null){ return null }
      if(data.constructor === Object){
        var obj = {}
        for(let key in data){
          obj[key] = foo(data[key])
        }
        return obj
      }else if(data.constructor === Array){
        var arr = []
        for(let i=0, len=data.length; i < len; i++){
          arr.push(foo(data[i]))
        }
        return arr
      }
    }
  }

  res.data = foo(res.data)
  return res
}

// 转换为表单数据(x-www-form-urlencoded)
// function toFormData(data){
//   if(data){
//     // var formData = new FormData()
//     // for(let key in data){
//     //   formData.append(key, data[key])
//     // }

//     // return formData

//     // return Object.keys(data).map(function(key){
//     //   return `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`
//     // }).join('&')
//   }
// }

window._request = axiosInstance