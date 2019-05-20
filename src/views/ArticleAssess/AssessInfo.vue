<template>
  <article-view v-bind="{ art, source, minusHeight: '300px' }"> <!-- 顶栏50 + 底栏250 -->
    <div class="com-ab-center com-reloadBtn" v-if="status === 'error'" @click="load">重新加载</div>
    <footer v-else>
      <div class="com-fillTitle">我的审核记录</div>
      <p class="status">
        <span :class="'status' + assessStatus">
          {{ ['　　　', '待审核', '已通过', '被驳回'][assessStatus] }}&emsp;
        </span>
        <span class="date">{{ date }}</span>
      </p>
      <div class="remark">
        理由：{{ remark || '未填写' }}
      </div>
    </footer>
  </article-view>
</template>

<script>
import ArticleView from '@c/layout/ArticleView'
export default {
  components: {
    ArticleView
  },

  data (){
    return {
      id: '',
      art: null,
      source: null,
      status: 'init',
      assessStatus: 0,
      date: '',
      remark: ''
    }
  },

  mounted (){
    this.id = this.$route.params.id
    this.remark = this.$route.params.remark || ''
    this.assessStatus = this.$route.params.status
    this.load()
  },

  methods: {
    // 载入文章&审核状态
    load (){
      this.status = 'loading'
      this.$bus.$emit('vux.spinner.show')
      Promise.all([
        _request({
          url: 'article/shenhe/article',
          params: { article_id: this.id }
        }),
        
        _request({
          url: 'article/source',
          params: { article_id: this.id }
        })
      ])
      .then(([{data: art}, {data: source}]) =>{
        this.$bus.$emit('vux.spinner.hide')
        if(art.result && source.result){
          this.status = 'success'
          this.art = art.ret
          this.source = source.ret
          this.date = art.ret.updated_at
        }else{
          this.status = 'error'
          this.$bus.$emit('vux.toast', art.message)
        }
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
footer{
  height: 250px;
  background-color: white;
  font-size: 18px;

  * {
    vertical-align: middle; 
  }
  
  .com-fillTitle{
    line-height: 40px;
  }

  .status{
    padding: 10px;

    [class*="status"]{
      position: relative;
      top: -1px;
    }
    .status1{
      color: #c6c6c6;
    }
    .status2{
      color: @success;
    }
    .status3{
      color: @danger;
    }
  }

  .remark{
    padding: 0 10px;
    height: 160px;
    overflow: auto;
  }
}
</style>
