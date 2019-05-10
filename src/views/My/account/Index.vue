<template>
  <div class="com-container">
    <vue-header title="帐号管理"></vue-header>
    <vux-group class="com-group-noMarginTop">
      <vux-cell title="更换手机号" :is-link="true"
        @click.native="beforeAlert('my/account/change_phone', '更换手机号', '是否更换手机号？')">
        <span class="com-cell-text phoneNum">{{ phoneNum }}</span>
      </vux-cell>

      <vux-cell title="修改密码" :is-link="true"
        @click.native="beforeAlert('my/account/change_psd', '修改密码', '是否修改密码？')">
      </vux-cell>

      <vux-cell title="解绑微信号" :is-link="true"
        @click.native="beforeAlert('my/account/unbind_weixin')">
      </vux-cell>
    </vux-group>
  </div>
</template>

<script>


export default {
  data (){
    return {
      phoneNum: this.$store.state.user.userInfo.phonenum
    }
  },

  methods: {
    beforeAlert (link, title, content){
      this.$vux.confirm.show({
        title: '提示',
        content,
        onConfirm: () => this.$toView('sub/before_check_psd', {
          params: {
            title,
            next: link
          }
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>
