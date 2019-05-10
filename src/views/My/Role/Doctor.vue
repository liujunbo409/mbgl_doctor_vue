<template>
  <role-base role="doctor" @ready="submit" ref="body"></role-base>
</template>

<script>
import RoleBase from './sub/Base'
import upload from '@u/request/upload'

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
      Promise.all([
        upload(data.zgzj_img),
        upload(data.zyzj_img)
      ])
      .then(([zgzj, zyzj]) =>{
        console.log(zgzj, zyzj)
        data.zgzj_img = Vue._GLOBAL.qiniuPic + zgzj.key
        data.zyzj_img = Vue._GLOBAL.qiniuPic + zyzj.key
      })
      .then(() =>{
        return _request({
          url: 'apply/doctorApplyPost',
          method: 'post',
          data
        }).then(({data}) =>{
          this.$refs.body.disabled = false
          if(data.result){
            this.$bus.$emit('vux.alert', '上传成功')
          }else{
            this.$bus.$emit('vux.toast', data.message)
          }
        })
      })
      .catch(e =>{
        console.log(e)
        this.$refs.body.disabled = false
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
