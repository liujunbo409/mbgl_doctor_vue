<template>
  <div class="com-container">
    <vue-header title="用户反馈"></vue-header>

  </div>
</template>

<script>
export default {
  data (){
    return {
      types: []
    }
  },

  mounted (){
    _request({
      baseURL: Vue._GLOBAL.comApi,
      url: 'feedback'
    }).then(({data}) =>{
      if(data.result){
        this.types = Object.values(data.ret)
      }
    })
  },

  methods: {

  }
}
</script>

<style lang="less" scoped>

</style>
