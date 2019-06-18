<template>
  <!-- 无重新加载按钮 -->
  <div class="com-container">
    <vue-header :title="`${listType === 'collect' ? '收藏' : '认可'}文章列表`">
      <span @click="toggleListType">切换列表</span>
    </vue-header>
    <vux-tab :animate="false">
      <tab-item ref="firstTab" @click.native="selected = 'all'">全部</tab-item>
      <tab-item v-for="({name, id}, index) in baseIllList" :key="index"
        @click.native="selected = id"
      >{{ name }}</tab-item>
    </vux-tab>

    <vux-tab :animate="false">
      <tab-item ref="typeFirstTab" @click.native="typeSelected = 2">科普文</tab-item>
      <tab-item @click.native="typeSelected = 1">专业文</tab-item>
    </vux-tab>

    <view-box minus="132px">
      <vux-group class="com-group-noMarginTop">
        <div class="search-bar" v-if="selected !== 'recently'">
          <div class="com-input-container">
            <input type="text" v-model="articleKeyword" placeholder="请输入要搜索的文章名">
          </div>
        </div>

        <article-item v-for="(item, index) in showArticleList" :key="index" :ret="item"
          @click.native="toArticle(item)"
        ></article-item>

        <div class="noArticleData"
          v-if="!showArticleList.length && status !== 'loading'"
        >暂无数据</div>
      </vux-group>
    </view-box>

    <footer @click="$toView('article_all')">查看全部文章</footer>
  </div>
</template>

<script>
import { Tab, TabItem } from 'vux'
import ArticleItem from '@c/item/ArticleItem'

export default {
  components: {
    VuxTab: Tab, TabItem,
    ArticleItem
  },

  data (){
    return {
      articleList: [],
      listType: 'collect',
      cache: {
        collect: {},
        accept: {}
      },
      status: 'init',
      selected: 'all',
      articleKeyword: '',
      typeSelected: 2
    }
  },

  mounted (){
    this.$refs.firstTab.$el.click()
    this.$refs.typeFirstTab.$el.click()
    this.load(2)
  },

  computed: {
    baseIllList (){
      return this.$store.getters['baseIllList/plain']
    },

    // 过滤文章列表
    showArticleList (){
      return this.articleList.filter(val => val.article.title.toString().indexOf(this.articleKeyword) >= 0)
    },
  },

  watch: {
    selected (val){
      Vue.nextTick(() => this.$refs.typeFirstTab.$el.click())
      if(this.baseIllList.map(val => val.id).includes(val)){
        this.load(2, val)
      }
      if(val === 'all'){
        this.load(2)
      }
    },

    listType (){
      this.load(this.typeSelected, this.selected)
    },

    typeSelected (val){
      this.load(val, this.selected)
    }
  },

  methods: {
    load (type = 2, catalogId = 'all'){
      // 判断是否有缓存
      if(type === 1 && this.cache[this.listType][catalogId] && this.cache[this.listType][catalogId].zhuanYe){
        this.articleList = this.cache[this.listType][catalogId].zhuanYe
        return
      }
      if(type === 2 && this.cache[this.listType][catalogId] && this.cache[this.listType][catalogId].kePu){
        this.articleList = this.cache[this.listType][catalogId].kePu
        return
      }

      this.status = 'loading'
      if(!this.cache[this.listType][catalogId]){
        this.cache[this.listType][catalogId] = {}
      }
      this.articleList = []
      this.$bus.$emit('vux.spinner.show')

      _request({
        url: `article/${this.listType}List`,
        params: {
          style: type,
          ill_id: catalogId === 'all' ? '' : catalogId
        }
      }).then(({data}) =>{
        this.$bus.$emit('vux.spinner.hide')
        if(data.result){
          this.status = 'success'
          if(type === 1){
            this.cache[this.listType][catalogId].zhuanYe = data.ret.data
            if(this.typeSelected === 1){
              this.articleList = data.ret.data
            }
          }
          if(type === 2){
            this.cache[this.listType][catalogId].kePu = data.ret.data
            if(this.typeSelected === 2){
              this.articleList = data.ret.data
            }
          }
        }else{
          this.status = 'error' + type
          this.$bus.$emit('vux.toast', data.message)
        }
      }).catch(e =>{
        this.status = 'error' + type
        this.$bus.$emit('vux.spinner.hide')
        console.log(e)
        this.$bus.$emit('vux.toast', {
          type: 'cancel',
          text: '网络错误'
        })
      })
    },

    toggleListType (){
      this.listType = this.listType === 'collect' ? 'accept' : 'collect'
    },

    toArticle (data){
      console.log(data)
      this.$toView('article_all/article', {
        params: {
          data,
          type: this.typeSelected,
          listType: 'menu',
          near: false
        }
      })
    },
  }
}
</script>

<style lang="less" scoped>
footer{
  text-align: center;
  background-color: @theme;
  color: white;
  font-size: 18px;
  line-height: 44px;
}

.noArticleData{
  position: fixed;
  left: 0;
  right: 0;
  top: 134px;
  bottom: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #eee;
  color: #666;
  font-size: 18px;
}

.search-bar{
  height: 35px;

  .com-input-container{
    height: 100%;
    box-sizing: border-box;
    background-color: #eee;
    border-top: 1px #ccc solid;
    border-bottom: 1px #ccc solid;

    > input{
      padding: 10px;

    }
  }
}
</style>
