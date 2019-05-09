<template>
  <!-- 直接借用Register页面 -->
  <reset-psd :resetPsd="request" ref="body"></reset-psd>
</template>

<script>
import ResetPsd from './Register'

export default {
  components: {
    ResetPsd
  },

  data (){
    return {
      // 传入操作函数
      request: data =>{
        this.$refs.body.disabld = true
        this.$store.dispatch('user/resetPsd', data)
        .then(() =>{
          this.$refs.body.disabld = false
          this.$toView('home')
          this.$bus.$emit('vux.alert', '重置成功，请牢记新密码！')          
        })
        .catch(e =>{
          this.$refs.body.disabld = false
          var text = e.timeout ? '网络错误' : e.message
          this.$bus.$emit('vux.toast', text)
        })
      }
    }
  },

  methods: {

  }
}
</script>

<style lang="less" scoped>

</style>
