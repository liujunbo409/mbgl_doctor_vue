<template>
  <article-view 
    v-bind="{ art, source, near: true, next, last, nextStatus, lastStatus }" 
    minusHeight="46px - 60px"
  >
    <div class="com-ab-center com-reloadBtn" v-if="status === 'error'" @click="load">重新加载</div>
    <footer>
      <div class="btn">
        <img src="@img/btn/test.png" >
        <div class="text">考核问题</div>
      </div>
      <div class="btn">
        <img src="@img/btn/feedback.png" >
        <div class="text">文章反馈</div>
      </div>
      <div class="btn">
        <img src="@img/btn/collected.png" v-if="collected">
        <img src="@img/btn/uncollected.png" v-else>
        <div class="text">文章收藏</div>
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
      illId: '',
      muLu_Id: '',
      type: '',
      
      // 这些都是要传给articleView的
      art: null,
      source: null,
      next: null,
      last: null,
      nextStatus: 'init',
      lastStatus: 'init',

      status: 'init',
      collected: false
    }
  },

  mounted (){
    var {data} = this.$route.params
    this.id = data.article.id
    this.illId = data.ill_id
    this.muLu_Id = data.mulu_Id
    this.type = this.$route.params.type

    this.load()
    this.loadNear()
    this.loadNear('last')
  },

  methods: {
    load (){
      this.status = 'loading'
      this.$bus.$emit('vux.spinner.show')
      Promise.all([
        _request({
          url: 'article/article',
          params: {
            article_id: this.id,
            ill_id: this.illId
          }
        }),
        
        _request({
          url: 'article/source',
          params: { article_id: this.id }
        }),
      ]).then(([{data: article}, {data: source}]) =>{
        this.$bus.$emit('vux.spinner.hide')
        if(article.result && source.result){
          this.status = 'success'
          this.art = article.ret
          this.source = source.ret
        }else{
          this.status = 'error'
        }
      }).catch(e =>{
        this.$bus.$emit('vux.spinner.hide')
        this.status = 'error'
        console.log(e)
        this.bus.emit('vux.toast', {
          type: 'cancel',
          text: '网络错误'
        })
      })
    },

    loadNear (type = 'next'){
      _request({
        url: 'article/newNearArticle',
        params: {
          article_id: this.id,
          type,
          mulu_id: this.muLu_Id,
          style: { zhuanYe: 1, kePu: 2 }[this.type]
        }
      }).then(({data}) =>{
        if(data.result){
          this[`${type}Status`] = 'success'
          this[type] = data.ret
        }else{
          this[`${type}Status`] = 'error'
        }
      }).catch(e =>{
        console.log(e)
        this[`${type}Status`] = 'error'
      })
    }
  }
}


</script>

<style lang="less" scoped>
footer{
  display: flex;
  width: 100%;
  height: 60px;
  background-color: white;

  .btn{
    flex: 0 0 33.3%;
    text-align: center;
    position: relative;
    padding: 5px;
    box-sizing: border-box;

    > img{
      width: 25px;
    }

    &:nth-child(2)::before, 
    &:nth-child(2)::after{
      content: '';
      position: absolute;
      width: 1px;
      height: 50%;
      background-color: #c6c6c6;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
    }

    &:nth-child(2)::after{
      left: unset;
      right: 0;
    }
  }
}
</style>
