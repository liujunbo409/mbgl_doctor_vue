<template>
  <div class="com-container">
    <vue-header title="资格认证"></vue-header>
    <vux-group class="com-group-noMarginTop">
      <vux-cell title="医生" :is-link="true" link="/my/role/doctor">
        <span class="com-cell-text danger">{{ doctorStatus }}</span>
      </vux-cell>
      <vux-cell title="护士" :is-link="true" link="/my/role/nerse">
        <span class="com-cell-text danger">{{ nerseStatus }}</span>
      </vux-cell>
    </vux-group>
  </div>
</template>

<script>


export default {
  data (){
    return {
      doctorStatus: '',
      nerseStatus: ''
    }
  },

  mounted (){
    _request({
      url: 'apply/shenheStatus'
    }).then(({data}) =>{
      if(data.result){
        this.doctorStatus = data.ret.doctor_status_str
        this.nerseStatus = data.ret.nurse_status_str
      }
    })
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
