<template>
  <div class="com-container">
    <vue-header :title="resetPsd ? '重置密码' : '注册'" :visibleHomeBtn="false"></vue-header>
      <x-input type="number" v-model.trim="phoneNum" :disabled="disabled" placeholder="请输入手机号"
        :max="11" is-type="china-mobile"
        :show-clear="false"
      >
        <img slot="label" src="@img/sub/phone.png" class="com-input-icon">
      </x-input>

      <x-input v-model.trim="vcCodeInputVal" :disabled="disabled" placeholder="请输图片验证码"
        :show-clear="false"
      >
        <img slot="label" src="@img/sub/security.png" class="com-input-icon">
        <vc-code slot="right" :identifyCode="vcCode" ref="vcCodeImg" @click.native="refreshVcCode"></vc-code>
      </x-input>

      <x-input v-model.trim="msgVcCodeInputVal" :disabled="disabled || msgDisabled" placeholder="请输短信验证码"
        :show-clear="false"
        @click.native="msgDisabled && $bus.$emit('vux.toast', '请先输入图片验证码')"
      >
        <img slot="label" src="@img/sub/message.png" class="com-input-icon">
        <div slot="right" class="getMsgVcCodeBtn"
          :class="{ disabled: getMsgVcCodeTimeoutKey !== 0 || msgDisabled }"
          :identifyCode="vcCode"
          @click="getMsgVcCode"
        >
          {{ getMsgVcCodeTimeout === 60 ? ' 获取验证码' : `${getMsgVcCodeTimeout}s` }}
        </div>
      </x-input>

      <x-input type="password" v-model.trim="password" :disabled="disabled" 
        :placeholder="resetPsd ? '请设置新密码' : '请输入密码'"
        :show-clear="false"
      >
        <img slot="label" src="@img/sub/lock.png" class="com-input-icon">
      </x-input>

      <x-input type="password" v-model.trim="passwordCheck" :disabled="disabled" placeholder="请再次输入密码"
        :show-clear="false"   
      >
        <img slot="label" src="@img/sub/lock.png" class="com-input-icon">
      </x-input>

      <div class="registerBtn-container">
        <x-button :text="resetPsd ? '重置密码' : '注册'" :disabled="disabled" @click.native="register"></x-button>
      </div>
  </div>
</template>

<script>
import { XInput, XButton } from 'vux'
import VcCode from '@c/VcCode'
import localStorage from '@u/localStorage'

// 用于生成验证码的随机数
var random = () => Math.floor(Math.random() * (9999 - 1000) + 1000).toString()

export default {
  components: {
    XInput, XButton, VcCode
  },

  props: [
     // 因为重置密码页面的布局和该组件大致相同，这里传入一个函数用于重置密码的逻辑，同时判断该参数传入时，
     // 为resetPsd模式，显示对应的文字，使用传入的函数
    'resetPsd'   
  ],

  data (){
    return {
      phoneNum: '',
      // vcCode = 验证码
      vcCode: random(),
      vcCodeInputVal: '',
      msgVcCodeInputVal: '',    // 短信验证码
      getMsgVcCodeTimeout: 60,
      getMsgVcCodeTimeoutKey: 0,  // 当该值非0时，禁用获取验证码的按钮
      password: '',
      passwordCheck: '',
      disabled: false,
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

    // 下面以test开头的方法为检查表格各个字段，若正确则返回correct，否则按类型返回对应的错误类型关键字
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

    testPassword (){
      var val = this.password || ''
      if(val === ''){
        return 'empty'
      }
      if(!/^[a-zA-Z0-9%&@_!#\$\^\*]{6,12}$/.test(val)){
        return 'badFormat'
      }
      return 'correct'
    },

    testPasswordCheck (){
      var val = this.passwordCheck || ''
      if(val !== this.password){
        return 'noIdentical'
      }
      return 'correct'
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

    // 登录
    register (){
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

      type = this.testPassword()
      if(type !== 'correct'){
        var text = {
          empty: '密码不能为空',
          badFormat: '密码需在6~12位之间，且不能包含!@#￥%^&*以外的特殊字符'
        }[type]

        this.$bus.$emit('vux.toast', {
          text,
          width: '12.6em'
        })

        return
      }

      type = this.testPasswordCheck()
      if(type !== 'correct'){
        var text = {
          noIdentical: '两次输入的密码不一致'
        }[type]

        this.$bus.$emit('vux.toast', text)

        return
      }

      // 注册主逻辑
      var {
        phoneNum: phonenum,
        password,
        msgVcCodeInputVal: sm_validate
      } = this

      var requestBody = { phonenum, password, sm_validate }
      if(this.resetPsd){
        this.resetPsd(requestBody)
      }else{
        this.disabled = true
        this.$store.dispatch('user/register', requestBody)
        .then(() =>{
          this.disabled = false
          this.$bus.$emit('vux.toast', { type: 'success', text: '注册成功' })
          this.$store.dispatch('hospList/load')
          this.$store.dispatch('user/editStatus/get')
          this.$toView('my/info')
        }).catch(e =>{
          this.disabled = false
          var text = e.timeout ? '网络错误' : e.message
          this.$bus.emit('vux.toast', {
            type: 'cancel', text
          })
        })
      }
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
</style>
