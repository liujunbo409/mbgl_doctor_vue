<template>
  <div class="com-container">
    <vue-header title="考核问题"></vue-header>
    <view-box class="com-header-view">
      <main>
        <div v-for="({question, answers}, index) in list" :key="index" class="testBox">
          <p class="title">问题{{ index + 1 }}：{{ question }}</p>
          <ol type="A" class="options">
            <li v-for="(option, index) in answers.split('&&')" :key="index">{{ option }}</li>
          </ol>
        </div>
      </main>
    </view-box>
    <div class="com-ab-center com-reloadBtn" @click="load" v-if="status === 'error'">重新加载</div>
  </div>
</template>

<script>
export default {
  data (){
    return {
      id: '',
      status: 'init',
      list: []
    }
  },
  
  mounted (){
    this.id = this.$route.params.id
    this.load()
  },

  methods: {
    load (){
      this.status = 'loading'
      this.$bus.$emit('vux.spinner.show')
      _request({
        url: 'article/question',
        params: {
          article_id: this.id
        }
      }).then(({data}) =>{
        this.$bus.$emit('vux.spinner.hide')
        this.status = 'success'
        this.list = data.ret
      }).catch(e =>{
        this.status = 'error'
        this.$bus.$emit('vux.spinner.hide')
        console.log(e)
        this.$bus.$emit('vux.toast', {
          type: 'cancel',
          text: '网络错误'
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.testBox{
  margin: 10px;
  margin-bottom: 20px;

  .title{
    font-size: 16px;
  }

  .options{
    padding-left: 30px;
    margin-top: 10px;

    > li{
      line-height: 2;
    }
  }
}
</style>
