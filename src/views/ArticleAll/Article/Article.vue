<template>
  <article-view 
    v-bind="{ art, source, near, next, last, nextStatus, lastStatus, nexus }" 
    minusHeight="46px - 60px"
    @onClickLast="clickNear"
    @onClickNext="clickNear"
    @onClickNexus="clickNexus"
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
        <img src="@img/btn/collected.png" v-if="collected" @click="toggleCollectStatus">
        <img src="@img/btn/uncollected.png" v-else @click="toggleCollectStatus">
        <div class="text">文章收藏</div>
      </div>
      <div class="btn" v-if="visibleAcceptBtn">
        <img src="@img/btn/good_fill.png" v-if="accepted" @click="toggleAcceptStatus">
        <img src="@img/btn/good.png" v-else @click="toggleAcceptStatus">
        <div class="text">认可文章</div>
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
      id: '',     // 文章id
      illId: '',
      muLu_Id: '',
      type: '',   // 文章类型（专业，科普）
      listType: '',   //  列表类型，目前有最近更新列表和目录列表
      
      // 这些都是要传给articleView的
      art: null,
      source: null,
      near: true,
      next: null,
      last: null,
      nextStatus: 'init',
      lastStatus: 'init',
      nexus: null,

      status: 'init',
      collected: false,
      accepted: false,  
      collectChangeCount: 0,   // 计数，防止用户短时间内频繁修改收藏状态
      collectPostStatus: 'init',   // 收藏按钮的提交状态
      visibleAcceptBtn: false,  // 有权限认可才显示认可按钮 
      acceptPostStatus: 'init'  // 认可按钮提交状态
    }
  },

  activated (){
    var {data} = this.$route.params
    if(data){
      this.id = data.article.id || data.id
      this.illId = data.ill_id
      this.muLu_Id = data.mulu_id
      this.type = this.$route.params.type
      this.listType = this.$route.params.listType
      if('near' in this.$route.params){
        this.near = this.$route.params.near
      }

      this.init()
      this.load()
      this.loadNear()
      this.loadNear('last')
      this.getCollectStatus()
      this.getNexus()
      this.checkRight()
    }
  },

  methods: {
    // 因为使用了组件缓存，需要手动初始化
    init (){
      this.art = null
      this.source = null
      this.next = null
      this.last = null
      this.nexus = null
      this.nextStatus = 'init'
      this.lastStatus = 'init'
      this.collectted = false
      this.collectChangeCount = 0
      this.collectPostStatus = 'init'   
      this.visibleAcceptBtn = false
    },

    // 加载文章主体和参考文献
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

    // 加载上下篇
    loadNear (type = 'next'){
      _request({
        url: `article/${this.listType === 'recently' ? 'newNearArticle' : 'nearArticle'}`,
        params: {
          article_id: this.id,
          type,
          mulu_id: this.muLu_Id,
          style: this.type
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

    // 获取收藏状态
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

    getAccpetStatus (){
      _request({
        url: 'article/accept',
        params: {
          role: this.$store.state.user.userInfo.role,
          article_id: this.id,
        }
      }).then(({data}) =>{
        if(data.result){
          this.accepted = data.ret
        }else{
          this.$bus.$emit('vux.toast', data.message)
        }
      })
    },

    // 获取关联文章
    getNexus (){
      _request({
        url: 'article/nexus',
        params: { article_id: this.id }
      }).then(({data}) =>{
        if(data.result){
          this.nexus = data.ret
        }
      }).catch(e =>{
        console.log(e)
      })
    },

    checkRight (){
      _request({
        url: 'article/acceptTitle',
        params: {
          ill_id: this.illId,
          article_id: this.id,
          role: this.$store.state.user.userInfo.role
        }
      }).then(({data}) =>{
         this.visibleAcceptBtn = data.result
      })
    },

    // 切换收藏状态
    toggleCollectStatus (){
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
        if(data.result){
          this.collectPostStatus = 'success'
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
    },

    // 切换认可状态
    toggleAcceptStatus (){0
      // 没有防连点
      if(this.acceptPostStatus === 'posting'){ return }
      this.acceptPostStatus = 'posting'
      _request({
        url: 'article/acceptPost',
        method: 'post',
        data: {
          ill_id: this.illId,
          article_id: this.id,
          role: this.$store.state.user.userInfo.role
        }
      }).then(({data}) =>{
        if(data.result){
          this.acceptPostStatus = 'success'
          this.accepted = !this.accepted
          this.$bus.$emit('vux.toast', `已${this.accepted ? '添加' : '取消'}认可`)
        }else{
          this.acceptPostStatus = 'error'
          this.$bus.$emit('vux.toast', data.message)
        }
      }).catch(e =>{
        this.acceptPostStatus = 'error'
        console.log(e)
        this.$bus.$emit('vux.toast', {
          type: 'cancel',
          text: '网络错误'
        })
      })
    },

    // 点击上下篇时切换
    clickNear (data){
      if(data.id === 0){ return }
      this.id = data.id
      this.init()
      this.load()
      this.loadNear()
      this.loadNear('last')
      this.getCollectStatus()
      this.getNexus()
    },

    // 点击关联文章时切换
    clickNexus (data){
      this.id = data.major_id
      this.type = data.style
      this.init()
      this.load()
      this.loadNear()
      this.loadNear('last')
      this.getCollectStatus()
      this.getNexus()
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
    flex: 1;
    text-align: center;
    position: relative;
    padding: 5px;
    box-sizing: border-box;

    > img{
      width: 25px;
    }

    &::before{
      content: '';
      position: absolute;
      width: 1px;
      height: 50%;
      background-color: #c6c6c6;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
    }

    &:first-child::before{
      display: none;
    }
  }
}
</style>
