<template>
  <div class="com-container">
    <vue-header title="考核问题"></vue-header>
    <div class="com-ab-center com-reloadBtn" @click="load">重新加载</div>
    <main>

    </main>
  </div>
</template>

<script>
export default {
  data (){
    return {
      id: ''
    }
  },
  
  mounted (){
    this.id = this.$route.params.id
    this.load()
  },

  methods: {
    load (){
      _request({
        url: 'article/question',
        params: {
          article_id: this.id
        }
      }).then(({data}) =>{
        console.log(data)
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>
