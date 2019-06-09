<template>
  <div class="com-container">
    <vue-header title="请登录" :visibleBackBtn="false" :visibleHomeBtn="false"></vue-header>
    <div class="form-container">
      <x-input type="number" v-model.trim="phoneNum" :disabled="disabled" placeholder="请输入手机号"
        :max="11" :show-clear="false"
        @on-blur="testPhoneNum"
      >
        <img slot="label" src="@img/sub/phone.png" class="com-input-icon">
      </x-input>

      <x-input type="password" v-model.trim="password" :disabled="disabled" placeholder="请输入密码"
        @on-blur="testPsd" :show-clear="false"
      >
        <img slot="label" src="@img/sub/lock.png" class="com-input-icon">
      </x-input>

      <div class="errorText-container" v-text="{
        none: '',
        empty: '帐号或密码不能为空',
        badFormat: '请输入正确的手机号'
      }[errorType]"></div>
      <div class="com-box loginBtn-container">
        <x-button text="登录" :disabled="disabled" @click.native="login"></x-button>
        <x-button text="注册" :disabled="disabled" @click.native="$toView('register')"></x-button>
        <div class="bottom-btns">
          <span class="forgetPsdBtn" @click="$toView('reset_psd')">忘记密码？</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { XHeader, XInput, XButton } from 'vux'
import localStorage from '@u/localStorage'

export default {
  components: {
    XHeader, XInput, XButton
  },

  data (){
    return {
      phoneNum: localStorage.get('phoneNum', ''),
      password: '',
      disabled: false,
      errorType: 'none'
    }
  },

  mounted (){

  },

  watch: {

  },

  methods: {
    // 判断手机号是否合法
    testPhoneNum (){
      var val = this.phoneNum
      if(val === ''){
        this.errorType = 'empty'
        return false
      }
      if(!/^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/.test(val)){
        this.errorType = 'badFormat'
        return false
      }

      this.errorType = 'none'      
      return true
    },

    // 判断密码
    testPsd (){
      var val = this.password
      if(val === ''){
        this.errorType = 'empty'
        return false
      }

      this.errorType = 'none'
      return true
    },

    // 登录逻辑
    login (){
      if(this.testPhoneNum() && this.testPsd()){
        this.disabled = true
        var {phoneNum, password} = this
        this.$store.dispatch('user/login', {
          phoneNum, password
        })
        .then(() =>{
          this.disabled = false
          this.$bus.$emit('vux.toast', { type: 'success', text: '登录成功' })
          this.$store.dispatch('hospList/load')
          this.$store.dispatch('user/editStatus/get').then(() => this.$toView('home'))
        }).catch(e =>{
          this.disabled = false
          // 这里拿到的错误对象的type属性为自定义的(在store)，用于提示非login接口返回的错误类型
          // 若不包含type，则为login接口返回的包含result为false的数据
          var text = {
            timeout: '网络错误',
            ban: '该账户已被禁用'
          }[e.type] || e.message
          this.$bus.$emit('vux.toast', {
            type: 'cancel', 
            text
          })
        })
      }else{
        this.$bus.$emit('vux.toast', {
          type: 'text',
          text: '请确认手机号与密码格式是否正确',
          width: '10em'
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .fillHeight{
    background-color: #F1F1F1;
  }

  .form-container{
    margin-top: 100px;
  }

  /deep/ .vux-x-input{
    background: white;
    box-sizing: border-box;

    &:not(:first-child){
      border-top: 0.5px #ccc solid;
    }
  }

  .errorText-container{
    @height: 40px;
    height: @height;
    line-height: @height;
    color: #e51c23;
    text-indent: 20px;
  }

  .loginBtn-container{
    text-align: center;

    /deep/ .weui-btn{
      width: 45%;
      display: inline-block;
      margin: 0 5px;
    }

    .bottom-btns{
      width: 100%;
      display: flex;
      margin-top: 10px;
      justify-content: right;

      // .registerBtn{
      //   color: rgb(3, 169, 244);
      // }

      .forgetPsdBtn{
        margin-left: auto;
        color: rgb(179, 179, 179);
      }      
    }
  }
</style>
