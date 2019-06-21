<template>
  <div class="com-container">
    <vue-header title="修改密码"></vue-header>
    <cell-input title="新密码　" placeholder="请在此输入密码" :value="newPsd" type="password"
      @input="val => newPsd = val" 
    ></cell-input>
    <cell-input title="确认密码" placeholder="请再次输入密码" :value="newPsdCheck" type="password"
      @input="val => newPsdCheck = val" 
    ></cell-input>
    <div class="com-mainBtn-container">
      <x-button text="保存新密码" :disabled="disabled" @click.native="change"></x-button>
    </div>
  </div>
</template>

<script>
import { XButton } from 'vux'
import CellInput from '@c/cell/CellInput'

export default {
  components: {
    XButton, CellInput
  },

  data (){
    return {
      newPsd: '',
      newPsdCheck: '',
      disabled: false
    }
  },

  mounted (){

  },

  methods: {
    // 修改密码的主逻辑
    change (){
      var {newPsd, newPsdCheck} = this

      if(!/^[a-z0-9@_]{6,12}$/.test(newPsd)){
        this.$bus.$emit('vux.toast', {
          text: '密码需在6~12位之间，且不能包含@和下划线以外的特殊字符',
          width: '12.6em'
        })
        return
      }

      if(newPsd !== newPsdCheck){
        this.$bus.$emit('vux.toast', '两次输入的密码不一致')
        return
      }

      this.$vux.loading.show()
      _request({
        url: 'my/revisePassword',
        method: 'post',
        data: {
          new_password: newPsd
        }
      }).finally(this.$vux.loading.hide)
      .then(({data}) =>{
        if(data.result){
          this.$bus.$emit('vux.alert', '密码修改成功')
          this.$router.back()
        }else{
          this.$bus.emit('vux.toast', {
            type: 'cancel',
            text: data.message
          })
        }
      }).catch(e =>{
        if(e.timeout){
          this.$bus.$emit('vux.toast', '网络错误')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>
