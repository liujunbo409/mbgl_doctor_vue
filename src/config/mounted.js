// 根实例的mounted
import localStorage from '@u/localStorage'

export default function(){
  var isLogin = localStorage.get('isLogin')
  if(isLogin){
    // 初始化医院数据
    this.$store.dispatch('hospList/load')
  
    // 获取填写状态
    this.$store.dispatch('user/editStatus/get')
  }
}