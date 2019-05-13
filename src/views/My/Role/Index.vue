<template>
  <div class="com-container">
    <vue-header title="资格认证"></vue-header>
    <vux-group class="com-group-noMarginTop">
      <vux-cell title="医生" :is-link="true" link="/my/role/doctor">
        <span class="com-cell-text" :class="{
          nocommintted: doctor === '未提交',
          ing: doctor === '待审核',
          done: doctor === '通过',
          rejected: doctor === '通过',
        }">{{ doctor }}</span>
      </vux-cell>
      <vux-cell title="护士" :is-link="true" link="/my/role/nurse">
        <span class="com-cell-text" :class="{
          nocommintted: doctor === '未提交',
          ing: doctor === '待审核',
          done: doctor === '通过',
          rejected: doctor === '通过',
        }">{{ nurse }}</span>
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
.nocommintted{
  color: red;
}
.ing{
  color: rgb(179, 179, 179);
}
.done{
  color: #47e247
}
.rejected{
  color: red;
}
</style>
