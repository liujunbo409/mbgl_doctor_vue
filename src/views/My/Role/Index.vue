<template>
  <div class="com-container">
    <vue-header title="资格认证"></vue-header>
    <vux-group class="com-group-noMarginTop">
      <vux-cell title="医生" :is-link="true" link="/my/role/doctor">
        <span class="com-cell-text danger">{{ doctor }}</span>
      </vux-cell>
      <vux-cell title="护士" :is-link="true" link="/my/role/nurse">
        <span class="com-cell-text danger">{{ nurse }}</span>
      </vux-cell>
    </vux-group>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data (){
    return {

    }
  },

  mounted (){

  },

  computed: {
    ...mapState('user/shenHeStatus', ['doctor', 'nurse'])
  },

  methods: {

  }
}
</script>

<style lang="less" scoped>
.danger{
  color: red;
}
</style>
