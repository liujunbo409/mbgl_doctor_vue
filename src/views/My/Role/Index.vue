<template>
  <div class="com-container">
    <vue-header title="资格认证"></vue-header>
    <vux-group class="com-group-noMarginTop">
      <vux-cell title="医生" :is-link="true" link="/my/role/doctor">
        <span class="com-cell-text" :class="statusText(this.doctorStatus, false)">
          {{ statusText(this.doctorStatus) }}</span>
      </vux-cell>
      <vux-cell title="护士" :is-link="true" link="/my/role/nurse">
        <span class="com-cell-text" :class="statusText(this.nurseStatus, false)">
          {{ statusText(this.nurseStatus) }}</span>
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
    doctorStatus (){
      return this.$store.state.user.userInfo.doctor_status
    },

    nurseStatus (){
      return this.$store.state.user.userInfo.nurse_status
    }
  },

  methods: {
    statusText (index, isViewText = true){
      if(isViewText){
        return ['未提交', '待审核', '通过', '被驳回'][index]
      }else{
        return ['nocommintted', 'ing', 'done', 'rejected'][index]
      }
    }
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
