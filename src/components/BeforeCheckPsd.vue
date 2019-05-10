<!-- 事先确认密码的页面，确认后为要进入的路由设置params参数psdChecked: true -->
<template>
  <div class="com-container">
    <vue-header :title="title"></vue-header>
    <cell-input title="当前密码" placeholder="请在此输入密码" :value="value" type="password"
      :disabled="disabled"
      @input="val => value = val" 
    ></cell-input>
    <div class="com-mainBtn-container">
      <x-button text="下一步" :disabled="disabled" @click.native="testPsd"></x-button>
    </div>
  </div>
</template>

<script>
import { XButton } from 'vux'
import CellInput from '@c/cell/CellInput'

export default {
  props: ['title', 'next'],

  components: {
    XButton,
    CellInput
  },

  data (){
    return {
      value: '',
      disabled: false
    }
  },

  methods: {
    // 验证当前密码是否正确
    testPsd (){
      if(!/^[a-z0-9@_]{6,12}$/.test(this.value)){
        this.$bus.$emit('vux.toast', {
          type: 'cancel',
          text: '密码错误'
        })
        return
      }

      this.disabled = true
      _request({
        url: 'my/validatePassword',
        method: 'post',
        data: {
          password: this.value
        }
      }).then(({data}) =>{
        this.disabled = false
        if(data.result){
          this.$router.replace({
            name: this.next,
            params: {
              psdChecked: true
            }
          })
        }else{
          this.$bus.$emit('vux.toast', '密码错误')
        }
      }).catch(e =>{
        console.log(e)
        this.$bus.$emit('vux.toast', '网络错误')
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>
