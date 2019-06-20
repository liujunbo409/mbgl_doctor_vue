// 全局变量，挂载于Vue._GLOBAL
const SERVER_TYPE = window.localStorage.getItem('SERVER_TYPE') || 'local'
const de = SERVER_TYPE === 'production' ? '' : 'de.'

export default {
  api: `http://${de}lljiankang.top/api/doctor/`,
  comApi: `http://${de}lljiankang.top/api/common/`,
  qiniuPic: 'http://desrc.lljiankang.top/'
}