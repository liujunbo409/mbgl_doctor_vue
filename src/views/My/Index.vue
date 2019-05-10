<template>
  <div class="com-container">
    <vue-header title="我的"></vue-header>
    <vux-group class="com-group-noMarginTop">
      <vux-cell title="个人信息" :is-link="true" link="/my/info"></vux-cell>
      <vux-cell title="帐号管理" :is-link="true" link="/my/account"></vux-cell>
      <vux-cell title="资格认证" :is-link="true" link="/my/role"></vux-cell>
    </vux-group>

    <vux-group>
      <vux-cell title="反馈" :is-link="true" link="/my/feedback"></vux-cell>      
    </vux-group>
  </div>
</template>

<script>


export default {
  data (){
    return {

    }
  },

  methods: {

  }
}
</script>

<style lang="less" scoped>

</style>
