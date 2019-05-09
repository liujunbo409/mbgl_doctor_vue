<template>
  <div class="com-container">
    <vue-header title="资格认证"></vue-header>
    <vux-group class="com-group-noMarginTop">
      <vux-cell title="医生" :is-link="true" link="/my/role/doctor"></vux-cell>
      <vux-cell title="护士" :is-link="true" link="/my/role/nerse"></vux-cell>
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
