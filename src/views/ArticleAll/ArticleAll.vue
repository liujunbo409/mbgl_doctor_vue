<template>
  <!-- 无重新加载按钮 -->
  <div class="com-container">
    <vue-header title="全部文章"></vue-header>
    <vux-tab :animate="false">
      <tab-item ref="firstTab" @click.native="selected = 'recently'">最近更新</tab-item>
      <tab-item v-for="({name, id}, index) in baseIllList" :key="index"
        @click.native="selected = id"
      >{{ name }}</tab-item>
    </vux-tab>

    <vux-tab :animate="false" v-show="visibleTypeTabs">
      <tab-item ref="typeFirstTab" @click.native="selectType(2)">科普文</tab-item>
      <tab-item ref="typeLastTab" @click.native="selectType()">专业文</tab-item>
    </vux-tab>

    <view-box minus="88px" v-if="visibleArticleList">
      <vux-group class="com-group-noMarginTop">
        <div class="currentDir" v-if="selected !== 'recently'">
          <span class="prifix">当前目录：</span>
          <span class="dir-text">
            {{ baseIllList.filter(val => val.id === selected)[0].name }}-<!--
          -->{{ dirDepth.map(val => val.catalog_name).join('-') }}
          </span>
          <div class="backBtn" @click="backCatalog">
            <span>返回目录</span>
            <img src="@img/btn/dir-back.png" width="20px">
          </div>
        </div>

        <div class="search-bar" v-if="selected !== 'recently'">
          <div class="com-input-container">
            <input type="text" v-model="articleKeyword" placeholder="请输入要搜索的文章名">
          </div>
        </div>

        <article-item v-for="(item, index) in showArticleList" :key="index" :ret="item"
          @click.native="toArticle(item)"
        ></article-item>

        <div class="noArticleData"
          v-if="!articleList.length && articleListStatus === 'success'"
        >暂无数据</div>
      </vux-group>
    </view-box>

    <div class="search-bar" v-if="visibleSearchBar">
      <div class="com-input-container">
        <input type="text" v-model="keyword" placeholder="请输入要搜索的目录名">
      </div>
    </div>

    <!-- 这个reload按钮只适用于最近更新的列表 -->
    <!-- <div class="com-reloadBtn com-ab-center"
      v-if="
        (status === 'error1' && typeSelected === 'zhuanYe') ||
        (status === 'error2' && typeSelected === 'kePu')
      "
      @click="load(status.split('error')[1])"
    >重新加载</div> -->

    <view-box minus="79px" v-if="visibleCatalog" >
      <catalog-group :catalogs="showillList" class="catalog" :onClickTitle="onClickTitle"></catalog-group>
    </view-box>
  </div>
</template>

<script>
import { Tab, TabItem } from 'vux'
import ArticleItem from '@c/item/ArticleItem'
import CatalogGroup from '@c/Catalog/CatalogGroup'

// 这是一个类，用来树化疾病目录
import List from './list' 
export default {
  components: {
    VuxTab: Tab, TabItem,
    ArticleItem, CatalogGroup
  },

  data (){
    return {
      articleList: [],
      cache: {},                 // 缓存列表
      visibleArticleList: true, //文章列表显示

      articleListStatus: 'init',         // 文章列表状态
      catalogStatus: 'init',         // 目录状态
      selected: 'recently',      // 疾病选择状态，最近更新为recently，疾病时为疾病id
      dirDepth: [],      // 层级深度
      typeSelected: 2,  // 专业科普选择状态 
      visibleTypeTabs: true,  // 专业科普tab显示状态

      keyword: '',
      articleKeyword: '',
      visibleSearchBar: false,  // 搜索栏显示

      illLists: [],
      visibleCatalog: false,
      openingMenuId: 0,

      // 点击catalog的目录标题时的事件
      onClickTitle: menu =>{
        this.visibleCatalog = false
        this.visibleSearchBar = false
        this.visibleArticleList = true
        this.visibleTypeTabs = true
        Vue.nextTick(() => {
          if(this.cache[this.openingMenuId].selectedType){
            this.$refs[`${this.cache[this.openingMenuId].selectedType === 2 ? 'typeFirstTab' : 'typeLastTab'}`].$el.click()
          }else{
           this.$refs.typeFirstTab.$el.click() 
          }
        })
        this.openingMenuId = menu.id

        var list = new List(this.illLists)
        this.dirDepth = list.getParents(menu)
        this.load(2)
        
        this.typeSelected = this.cache[this.openingMenuId].selectedType
      }
    }
  },

  mounted (){
    // 默认选择
    this.$refs.firstTab.$el.click()
    this.$refs.typeFirstTab.$el.click()
    this.load(2, 'recently')
  },

  computed: {
    // 基础疾病列表
    baseIllList (){
      return this.$store.getters['baseIllList/plain']
    },

    // 过滤文章列表
    showArticleList (){
      return this.articleList.filter(val => val.article.title.toString().indexOf(this.articleKeyword) >= 0)
    },

    // 过滤目录列表
    showillList (){
      var list = new List(this.illLists.filter(val =>{
        return val.catalog_name.toString().indexOf(this.keyword) >= 0
      }))
      return list.toTree() 
    }
  },

  watch: {
    // 基本思路：以多个变量控制不同ui显示
    selected (val){
      if(this.baseIllList.map(val => val.id).includes(val)){
        this.loadillList(val)
        this.visibleTypeTabs = false
        this.visibleArticleList = false
        this.visibleSearchBar = true
        this.visibleCatalog = true
      }
      if(val === 'recently'){
        this.visibleTypeTabs = true
        this.visibleArticleList = true
        this.visibleSearchBar = false
        this.visibleCatalog = false
        Vue.nextTick(() =>{
          if(this.cache['recently'].selectedType){
            this.$refs[`${this.cache['recently'].selectedType === 2 ? 'typeFirstTab' : 'typeLastTab'}`].$el.click()
          }else{
            this.$refs.typeFirstTab.$el.click() 
          }
        })
        this.load(2, 'recently')
      }
    },

    typeSelected (val){
      if(this.selected === 'recently'){
        this.load(val, 'recently')
      }else{
        this.load(val)
      }
    },
  },

  methods: {
    // 加载文章，当catalogId为recently时，加载最近更新
    load (type = 2, catalogId){
      catalogId = catalogId || this.openingMenuId
      // 判断是否有缓存
      if(type === 1 && this.cache[catalogId] && this.cache[catalogId].zhuanYe){
        this.articleList = this.cache[catalogId].zhuanYe
        return
      }
      if(type === 2 && this.cache[catalogId] && this.cache[catalogId].kePu){
        this.articleList = this.cache[catalogId].kePu
        return
      }

      this.articleListStatus = 'loading'
      if(!this.cache[catalogId]){
        this.cache[catalogId] = {}
      }
      this.articleList = []
      this.$bus.$emit('vux.spinner.show')
      _request({
        url: `article/${catalogId === 'recently' ? 'newArticleList' : 'articleList'}`,
        params: { 
          style: type,
          ...(catalogId !== 'recently' ? { mulu_id: catalogId } : {})
        }
      }).then(({data}) =>{
        this.$bus.$emit('vux.spinner.hide')
        if(data.result){
          this.articleListStatus = 'success'
          if(type === 1){
            this.cache[catalogId].zhuanYe = data.ret.data
            if(this.typeSelected === 1){
              this.articleList = data.ret.data
            }
          }
          if(type === 2){
            this.cache[catalogId].kePu = data.ret.data
            if(this.typeSelected === 2){
              this.articleList = data.ret.data
            }
          }
        }else{
          this.articleListStatus = 'error' + type
          this.$bus.$emit('vux.toast', data.message)
        }
      }).catch(e =>{
        this.articleListStatus = 'error' + type
        this.$bus.$emit('vux.spinner.hide')
        console.log(e)
        this.$bus.$emit('vux.toast', {
          type: 'cancel',
          text: '网络错误'
        })
      })
    },

    selectType (index = 1){
      this.typeSelected = index
      if(this.selected === 'recently'){
        if(!this.cache[this.selected]){
          this.cache[this.selected] = {}
        }
        this.cache[this.selected].selectedType = index
      }else{
        if(!this.cache[this.openingMenuId]){
          this.cache[this.openingMenuId] = {}
        }
        this.cache[this.openingMenuId].selectedType = index
      }
    },

    // 跳转至文章
    toArticle (data){
      this.$toView('article_all/article', {
        params: {
          data,
          type: this.typeSelected,
          listType: this.selected === 'recently' ? 'recently' : 'menu'
        }
      })
    },

    // 加载目录原始数据
    loadillList (ill_id){
      this.catalogStatus = 'loading'
      this.illLists = []
      this.$bus.$emit('vux.spinner.show')
      _request({
        url: 'article/mulu',
        params: { ill_id }
      }).then(({data}) =>{
        this.$bus.$emit('vux.spinner.hide')
        if(data.result){
          this.catalogStatus = 'success'
          this.illLists = data.ret
        }else{
          this.catalogStatus = 'error'
          this.$bus.$emit('vux.toast', data.message)
        }
      }).catch(e =>{
        this.$bus.$emit('vux.spinner.hide')
        console.log(e)
        this.catalogStatus = 'error'
      })
    },

    // 后退按钮
    backCatalog (){
      this.visibleTypeTabs = false
      this.visibleArticleList = false
      this.visibleSearchBar = true
      this.visibleCatalog = true
    }
  }
}
</script>

<style lang="less" scoped>
.com-container{
  background-color: white;
}

.scrollable .vux-tab-item{
  flex: 0 0 20%;
}

.catalogList{
  max-height: calc(~'100% - 90px - 44px');   // 减去上栏 + 两个tab高度
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

.catalog{
  margin-left: 10px;
}

.noArticleData{
  position: fixed;
  height: calc(~'100% - 164px');
  width: 100%;
  left: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #eee;
  color: #666;
  font-size: 18px;
}

.currentDir{
  box-sizing: border-box;
  font-size: 13px;
  padding: 5px;

   > *{
     vertical-align: middle;
   }

   .prifix{
     position: relative;
     top: 0.5px;
   }

  .dir-text{
    display: inline-block;
    width: calc(~'100% - 100px - 5em');
    overflow: auto;
    white-space: nowrap;
  }

  .backBtn{
    color: @theme;
    font-size: 14px;
    float: right;
    margin-right: 5px;
    position: relative;
    top: -1px;

    > * {
      vertical-align: middle;
    }
  }
}
</style>
