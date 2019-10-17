// 全局变量，挂载于Vue._GLOBAL
const SERVER_TYPE = window.localStorage.getItem('SERVER_TYPE') || 'local';
const de = SERVER_TYPE === 'production' ? '' : 'de.';

export default {
  doctor_qr_url:`http://${de}lljiankang.top/user/h5/vue/follow_doctors/role_select?UserId=`,
  api: `http://${de}lljiankang.top/api/doctor/`,
  // api: `http://localhost:8000/api/doctor/`,
  comApi: `http://${de}lljiankang.top/api/common/`,
  qiniuPic: 'http://desrc.lljiankang.top/'
}
