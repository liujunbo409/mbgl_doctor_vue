<template>
  <div class="com-container">
    <vue-header title="更换手机号"></vue-header>
    <x-input
      type="number"
      v-model.trim="phoneNum"
      placeholder="请输入新手机号"
      :max="11"
      is-type="china-mobile"
      :show-clear="false"
    >
      <img slot="label" src="@img/sub/phone.png" class="com-input-icon">
    </x-input>

    <x-input
      v-model.trim="vcCodeInputVal"
      placeholder="请输图片验证码"
      :show-clear="false"
    >
      <img slot="label" src="@img/sub/security.png" class="com-input-icon">
      <vc-code slot="right" :identifyCode="vcCode" ref="vcCodeImg" @click.native="refreshVcCode"></vc-code>
    </x-input>

    <x-input
      v-model.trim="msgVcCodeInputVal"
      placeholder="请输短信验证码"
      :show-clear="false"
      :class="{ disabledColor: msgDisabled }"
      @touchstart.native="onClickVcCodeInput"
    >
      <img slot="label" src="@img/sub/message.png" class="com-input-icon">
      <div
        slot="right"
        class="getMsgVcCodeBtn"
        :class="{ disabled: getMsgVcCodeTimeoutKey !== 0 || msgDisabled }"
        :identifyCode="vcCode"
        @click="getMsgVcCode"
      >{{ getMsgVcCodeTimeout === 60 ? ' 获取验证码' : `${getMsgVcCodeTimeout}s` }}</div>
    </x-input>

    <div class="com-mainBtn-container">
      <x-button text="确定" @click.native="change"></x-button>
    </div>
  </div>
</template>

<script>
import { XInput, XButton } from 'vux'
import VcCode from '@c/VcCode'

// 用于生成验证码的随机数
var random = () => Math.floor(Math.random() * (9999 - 1000) + 1000).toString()

export default {
  components: {
    XInput, XButton, VcCode
  },

  data() {
    return {
      phoneNum: '',
      // vcCode = 验证码
      vcCode: random(),
      vcCodeInputVal: '',
      msgVcCodeInputVal: '',    // 短信验证码
      getMsgVcCodeTimeout: 60,
      getMsgVcCodeTimeoutKey: 0,  // 当该值非0时，禁用获取验证码的按钮
    }
  },

  mounted (){

  },

  computed: {
    msgDisabled (){
      return this.vcCodeInputVal === '' || this.vcCode !== this.vcCodeInputVal
    }
  },

  methods: {
    refreshVcCode (){
      this.vcCode = random()
    },

    onClickVcCodeInput (e){
      if(this.msgDisabled){
        e.preventDefault()
        this.$bus.$emit('vux.toast', '请先输入正确的图片验证码')
      }
    },

    // 获取手机验证码
    getMsgVcCode (){
      if(this.msgDisabled){ return }
      if(this.getMsgVcCodeTimeoutKey !== 0){ return }   // 60秒限制中点击无效

      if(this.testPhoneNum() !== 'correct'){
        this.$bus.$emit('vux.toast', '请确认手机号是否正确填写')
        return
      }
      
      this.getMsgVcCodeTimeoutKey = 1
      _request({
        url: `login/${this.resetPsd ? 'validateOldPhonenum' : 'validateNewPhonenum'}`,
        params: { phonenum: this.phoneNum }
      }).then(({data}) =>{
        if(data.result){
          this.$bus.$emit('vux.toast', '短信验证码已发送')
          this.getMsgVcCodeTimeoutKey = setInterval(() =>{
            this.getMsgVcCodeTimeout--
            if(this.getMsgVcCodeTimeout === 0){
              clearInterval(this.getMsgVcCodeTimeoutKey)
              this.getMsgVcCodeTimeoutKey = 0
              this.getMsgVcCodeTimeout = 60
            }
          }, 1000)
        }else{
          this.getMsgVcCodeTimeoutKey = 0
          this.$bus.$emit('vux.toast', data.message)
        }
      })
    },  
    
    testPhoneNum (){
      var val = this.phoneNum || ''
      if(val === ''){
        return 'empty'
      }
      if(!/^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/.test(val)){
        return 'badFormat'
      }
      return 'correct'
    },

    testVcCode (){
      var val = this.vcCodeInputVal || ''
      if(val === ''){
        return 'empty'
      }
      if(val !== this.vcCode){
        return 'noIdentical'
      }
      return 'correct'
    },

    testMsgVcCode (){
      var val = this.msgVcCodeInputVal || ''
      if(val === ''){
        return 'empty'
      }
      return 'correct'
    },

    change (){
      // 对应上面的检查函数，为关键字映射错误信息
      var type = this.testPhoneNum()
      if(type !== 'correct'){
        var text = {
          empty: '手机号不能为空',
          badFormat: '手机号格式错误'
        }[type]

        this.$bus.$emit('vux.toast', text)

        return 
      }

      type = this.testVcCode()
      if(type != 'correct'){
        var text = {
          empty: '图片验证码不能为空',
          noIdentical: '图片验证码不正确',
        }[type]

        this.$bus.$emit('vux.toast', text)

        return
      }

      type = this.testMsgVcCode()
      if(type !== 'correct'){
        var text = {
          empty: '短信验证码不能为空',
        }[type]

        this.$bus.$emit('vux.toast', text)

        return
      }

      this.$vux.loading.show()
      _request({
        url: 'my/revisePhonenum',
        method: 'post',
        data: {
          sm_validate: this.msgVcCodeInputVal,
          phonenum: this.phoneNum
        }
      }).finally(this.$vux.loading.hide)
      .then(({data}) =>{
        if(data.result){
          this.$store.commit('user/writeState', data.ret)
          this.$bus.$emit('vux.alert', '更换成功')
          this.$router.back()
        }else{
          this.$bus.$emit('vux.toast', {
            type: 'cancel',
            text: data.message
          })
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
  /deep/ .vux-x-input{
    height: 45px;
    background: white;
    box-sizing: border-box;

    &:not(:first-child){
      border-top: 0.5px #ccc solid;
    }
  }

  /deep/ .vux-x-input.weui-cell.disabled{
    background-color: #eee;
  }

  .getMsgVcCodeBtn{
    display: inline-block;
    width: 112px;
    line-height: 30px;
    text-align: center;
    background-color: @theme;
    color: white;
    border-radius: 4px;
    font-size: 13px;
  }

  .getMsgVcCodeBtn.disabled{
    background-color: #ccc;
    pointer-events: none;
  }

  .registerBtn-container{
    padding: 0 10px;
    margin-top: 30px;
  }

  .disabledColor{
    background-color: #eee;
  }
</style>
