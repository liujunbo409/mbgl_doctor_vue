// 请求器实例，挂载于window._request
import axios from 'axios'
import localStorage from '@u/localStorage'

const SERVER_TYPE = window.localStorage.getItem('SERVER_TYPE') || 'local'

// baseURL使用proxyTable重写并跨域
var commonConfig = {
  timeout: 5000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  transformRequest: toFormData
}

var axiosInstance = axios.create({
  baseURL: `http://${SERVER_TYPE === 'production' ? '' : 'de.'}lljiankang.top/api/doctor/`,
  ...commonConfig
})
axiosInstance.interceptors.request.use(requestDataHandler)

// 若有token和userid，则自动添加
function requestDataHandler(config){
  if(config.method === 'post'){
    var {data} = config
    var {token, id} = localStorage.get('userInfo', {})
    if(token){ data.token = token }
    if(id){ data.user_id = id }
  }

  return config
}

// 转换为表单数据
function toFormData(data){
  if(data){
    return Object.keys(data).map(function(key){
      return `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`
    }).join('&')
  }
}

window._request = axiosInstance