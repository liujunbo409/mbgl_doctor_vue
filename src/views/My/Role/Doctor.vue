<template>
  <role-base role="doctor" @ready="submit"></role-base>
</template>

<script>
import RoleBase from './Base'
import UserInfoItem from '@c/cell/UserInfoItem'

import { mapGetters } from 'vuex'

export default {
  components: {
    RoleBase, UserInfoItem
  },

  data (){
    return {
      jiao_xue_ji_bing: ''
    }
  },

  mounted (){

  },

  methods: {
    submit (data){
      console.log(data)
    }
  }
}
</script>

<style lang="less" scoped>

</style>
