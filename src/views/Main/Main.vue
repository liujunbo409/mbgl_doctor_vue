<template>
  <!--
    该组件负责管理显示路由和管理公共通知组件，以及需要在所有路由中显示的组件  
  -->
  <div class="com-container">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>

<script>
import { Toast } from 'vux'

export default {
  components: {
    VuxToast: Toast
  },

  data (){
    return {

    }
  },

  mounted (){
    // 注意：添加vux的ui全局方法时，请绑定至this.$bus上，事件名以【vux.】为前缀
    
    /*
      显示toast提示，若未配置width，自动按文字长度调整宽度
      bus.$emit('vux.toast', '显示文字')
      bus.$emit('vux.toast', {
        ...配置(与vux toast配置属性相同)
      })   
    */
    this.$bus.$on('vux.toast', (...args) =>{
      if(typeof args[0] == 'string'){
        this.$vux.toast.show({
          text: args[0],
          position: args[1] || 'default',
          width: args[0].length + 2.6 + 'em'          
        })
      }else{
        var options = args[0]
        if(!options.width){
          options.width = args[0].text.length + 2.6 + 'em'
        }
        this.$vux.toast.show(options)
      }
    })

    // alert提示
    this.$bus.$emit('vux.alert', (content, options = {}) =>{
      this.$vux.alert.show({
        content,
        ...options
      })
    })

  },

  methods: {

  }
}
</script>

<style lang="less" scoped>

</style>
