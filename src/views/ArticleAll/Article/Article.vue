<template>
  <article-view 
    v-bind="{ art, source, near: true, next, last, nextStatus, lastStatus }" 
    minusHeight="46px - 60px"
  >
    <div class="com-ab-center com-reloadBtn" v-if="status === 'error'" @click="load">重新加载</div>
    <footer>
      <div class="btn" @click="$toView('article_all/article/test', { params: { id } })">
        <img src="@img/btn/test.png" >
        <div class="text">考核问题</div>
      </div>
      <div class="btn" @click="$toView('article_all/article/feedback', { params: { id } })">
        <img src="@img/btn/feedback.png" >
        <div class="text">文章反馈</div>
      </div>
      <div class="btn">
        <img src="@img/btn/collected.png" v-if="collected" @click="collectStatusToggle">
        <img src="@img/btn/uncollected.png" v-else @click="collectStatusToggle">
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
      collected: false,
      collectChangeCount: 0,   // 计数，防止用户短时间内频繁修改收藏状态
      collectPostStatus: 'init'   // 收藏按钮的提交状态
    }
  },

  activated (){
    var {data} = this.$route.params
    if(data){
      this.id = data.article.id
      this.illId = data.ill_id
      this.muLu_Id = data.mulu_Id
      this.type = this.$route.params.type

      this.init()
      this.load()
      this.loadNear()
      this.loadNear('last')
      this.getCollectStatus()
    }
  },

  methods: {
    init (){
      this.art = null
      this.source = null
      this.next = null
      this.last = null
      this.nextStatus = 'init'
      this.lastStatus = 'init'
      this.collectted = false
      this.collectChangeCount = 0
      this.collectPostStatus = 'init'   
    },

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
        this.$bus.$emit('vux.toast', {
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
    },

    getCollectStatus (){
      _request({
        url: 'article/collect',
        params: {
          article_id: this.id
        }
      }).then(({data}) =>{
        if(data.result){
          this.collected = data.ret
        }
      }).catch(e =>{
        console.log(e)
      })
    },

    collectStatusToggle (){
      this.collectChangeCount++
      setTimeout(() =>{
        this.collectChangeCount--
      }, 10000)

      if(this.collectChangeCount > 4){
        this.$bus.$emit('vux.toast', '您的操作过于频繁')
        return
      }

      if(this.collectPostStatus === 'posting'){ return }
      this.collectPostStatus = 'posting'
      _request({
        url: 'article/collectPost',
        method: 'post',
        data: {
          article_id: this.id,
          ill_id: this.illId
        }
      }).then(({data}) =>{
        this.collectPostStatus = 'success'
        if(data.result){
          this.collected = !this.collected
          this.$bus.$emit('vux.toast', `已${this.collected ? '加入' : '取消'}收藏`)
        }else{
          this.collectPostStatus = 'error'
          this.$bus.$emit('vux.toast', data.message)
        }
      }).catch(e =>{
        this.collectPostStatus = 'error'
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
