// 这里保存封装的vux全局方法
// 注意：添加方法时，请绑定至vue.$bus上，事件名以【vux.】为前缀

/*
  显示toast提示，若未配置width，自动按文字长度调整宽度
  bus.$emit('vux.toast', '显示文字')
  bus.$emit('vux.toast', {
    ...配置(与vux toast配置属性相同)
  })   
*/
export default function(vue){
  vue.$bus.$on('vux.toast', (...args) =>{
    if(typeof args[0] == 'string'){
      vue.$vux.toast.show({
        text: args[0],
        position: args[1] || 'default',
        width: args[0].length + 2.6 + 'em'          
      })
    }else{
      var options = args[0]
      if(!options.width){
        options.width = args[0].text.length + 2.6 + 'em'
      }
      vue.$vux.toast.show(options)
    }
  })

  // alert提示
  vue.$bus.$on('vux.alert', (content, options = {}) =>{
    vue.$vux.alert.show({
      content,
      ...options
    })
  })  

  // 选项页
  vue.$bus.$on('vux.actionsheet', (options) =>{
    vue.actionSheet = {
      onClick: options.onClick || new Function(),
      onCancel: options.onCancel || new Function(),
      onMask: options.onMask || new Function()
    }

    delete options.onClick
    delete options.onCancel
    delete options.onMask

    vue.actionSheet.options = {
      theme: 'android',
      ...options
    }
    vue.visibleActionSheet = true
  })

  // loading提示
  vue.$bus.$on('vux.spinner.show', (type) =>{
    if(type){
      vue.spinnerType = type
    }else{
      vue.spinnerType = 'crescent'
    }
    vue.visibleSpinner = true
  })
  vue.$bus.$on('vux.spinner.hide', () =>{
    vue.visibleSpinner = false
  })
}