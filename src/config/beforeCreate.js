// 根实例的beforeCreate钩子，主要用于接收beforeInit的数据（存于window._GLOBAL）
export default function(){
  this.$store.commit('user/changeAccess', window._GLOBAL.accessData)
}