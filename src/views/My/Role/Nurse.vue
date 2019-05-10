<template>
  <role-base role="nurse" :visible_Jiao_xue_ji_bing="false" @ready="submit" ref="body"></role-base>
</template>

<script>
import RoleBase from './sub/Base'

export default {
  components: {
    RoleBase
  },

  data (){
    return {
      jiao_xue_ji_bing: ''
    }
  },

  mounted (){

  },

  methods: {
    submit (data){
      this.$refs.body.disabled = true
      _request({
        url: 'apply/nurseApplyPost',
        method: 'post',
        data
      }).then(({data}) =>{
      this.$refs.body.disabled = false
        if(data.result){
          this.$bus.$emit('vux.alert', '上传成功')
        }else{
          this.$bus.$emit('vux.toast', data.message)
        }
      }).catch(e =>{
        this.$refs.body.disabled = false
        console.log(e)
        this.$bus.$emit('vux.toast', {
          type: 'cancel',
          text: '网络错误'
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>
