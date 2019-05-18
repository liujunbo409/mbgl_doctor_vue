<template>
  <div class="com-container">
    <vue-header title="全部文章"></vue-header>
    <vux-tab :animate="false">
      <tab-item ref="firstTab" @click.native="selected = 'recently'">最近更新</tab-item>
      <tab-item v-for="({name, id}, index) in baseIllList" :key="index"
        @click.native="selected = id"
      >{{ name }}</tab-item>
    </vux-tab>

    <vux-tab :animate="false" v-show="visibleTypeTabs">
      <tab-item ref="typeFirstTab" @click.native="typeSelected = 2">科普文</tab-item>
      <tab-item @click.native="typeSelected = 1">专业文</tab-item>
    </vux-tab>

    <view-box class="com-tab-view" :body-padding-bottom="0" 
      style="height:calc(100% - 134px) !important"
      v-if="visibleArticleList"
    >
      <vux-group class="com-group-noMarginTop">
        <article-item v-for="(item, index) in articleShowList" :key="index" :ret="item"
          @click.native="toArticle(item)"
        ></article-item>
        <div class="noArticleData" v-if="!articleShowList.length">暂无数据</div>
      </vux-group>
    </view-box>

    <div class="search-bar" v-if="visibleSearchBar">
      <div class="com-input-container">
        <input type="text" v-model="keyword" placeholder="请输入要搜索的目录名">
      </div>
    </div>

    <!-- 这个reload按钮只适用于最近更新的列表 -->
    <div class="com-reloadBtn com-ab-center"
      v-if="
        (status === 'error1' && typeSelected === 'zhuanYe') ||
        (status === 'error2' && typeSelected === 'kePu')
      "
      @click="load(status.split('error')[1])"
    >重新加载</div>

    <view-box class="com-tab-view" 
      v-if="visibleCatalog"
      :body-padding-bottom="0"
      style="height:calc(100% - 125px) !important">
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
      articleShowList: [],
      cache: {},                 // 缓存列表
      visibleArticleList: true, //文章列表显示

      status: 'init',         // 加载状态
      selected: 'recently',      // 疾病选择状态
      typeSelected: 2,  // 专业科普选择状态 
      visibleTypeTabs: true,  // 专业科普tab显示状态

      keyword: '',
      visibleSearchBar: false,  // 搜索栏显示

      illLists: [],
      visibleCatalog: false,
      openingMenuId: 0,

      onClickTitle: menu =>{
        this.visibleCatalog = false
        this.visibleSearchBar = false
        this.visibleArticleList = true
        this.visibleTypeTabs = true
        Vue.nextTick(() => this.$refs.typeFirstTab.$el.click())
        this.openingMenuId = menu.id
        this.load(2)
      }
    }
  },

  mounted (){
    this.$refs.firstTab.$el.click()
    this.$refs.typeFirstTab.$el.click()
    this.load(2, 'recently')
  },

  computed: {
    baseIllList (){
      return this.$store.getters['baseIllList/plain']
    },

    showillList (){
      var list = new List(this.illLists.filter(val =>{
        return val.catalog_name.toString().indexOf(this.keyword) >= 0
      }))
      return list.toTree() 
    }
  },

  watch: {
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
        Vue.nextTick(() => this.$refs.typeFirstTab.$el.click())
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
    load (type = 2, catalogId){
      catalogId = catalogId || this.openingMenuId
      if(type === 1 && this.cache[catalogId] && this.cache[catalogId].zhuanYe){
        this.articleShowList = this.cache[catalogId].zhuanYe
        return
      }
      if(type === 2 && this.cache[catalogId] && this.cache[catalogId].kePu){
        this.articleShowList = this.cache[catalogId].kePu
        return
      }

      console.log(this.cache[catalogId])
      if(!this.cache[catalogId]){
        this.cache[catalogId] = {}
      }
      this.articleShowList = []
      this.$bus.$emit('vux.spinner.show')
      this.status = 'loading'
      _request({
        url: `article/${catalogId === 'recently' ? 'newArticleList' : 'articleList'}`,
        params: { 
          style: type,
          ...(catalogId !== 'recently' ? { mulu_id: catalogId } : {})
        }
      }).then(({data}) =>{
        this.$bus.$emit('vux.spinner.hide')
        if(data.result){
          this.status = 'success'
          if(type === 1){
            this.cache[catalogId].zhuanYe = data.ret.data
            if(this.typeSelected === 1){
              this.articleShowList = data.ret.data
            }
          }
          if(type === 2){
            this.cache[catalogId].kePu = data.ret.data
            if(this.typeSelected === 2){
              this.articleShowList = data.ret.data
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

    toArticle (data){
      this.$toView('article_all/article', {
        params: {
          data,
          type: this.typeSelected,
          listType: this.selected === 'recently' ? 'recently' : 'menu'
        }
      })
    },

    loadillList (ill_id){
      this.illLists = []
      this.$bus.$emit('vux.spinner.show')
      _request({
        url: 'article/mulu',
        params: { ill_id }
      }).then(({data}) =>{
        this.$bus.$emit('vux.spinner.hide')
        if(data.result){
          this.illLists = data.ret
        }
      }).catch(e =>{
        this.$bus.$emit('vux.spinner.hide')
        console.log(e)
        // 未作失败处理
      })
    },
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
  height: calc(~'100% - 134px');
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
</style>
