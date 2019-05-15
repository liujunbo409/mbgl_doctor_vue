// 全局变量，挂载于Vue._GLOBAL
const SERVER_TYPE = window.localStorage.getItem('SERVER_TYPE') || 'local'
const api = `http://${SERVER_TYPE === 'production' ? '' : 'de.'}lljiankang.top/api/doctor/`
export default {
  api,
  comApi: 'http://de.lljiankang.top/api/common/',
  qiniuPic: 'http://desrc.lljiankang.top/'
}