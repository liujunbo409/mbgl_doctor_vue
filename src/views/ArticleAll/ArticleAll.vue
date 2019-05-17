<template>
  <div class="com-container">
    <vue-header title="全部文章"></vue-header>
    <vux-tab :animate="false">
      <tab-item ref="firstTab" @click.native="selected = 'recently'">最近更新</tab-item>
      <tab-item v-for="({name, id}, index) in baseIllList" :key="index"
        @click.native="selected = id"
      >{{ name }}</tab-item>
    </vux-tab>

    <vux-tab :animate="false" v-show="selected === 'recently'">
      <tab-item ref="typeFirstTab" @click.native="() =>{
        typeSelected = 'kePu'; recentlyShowList = []; load() 
      }">科普文</tab-item>
      <tab-item @click.native="() => { 
        typeSelected = 'zhuanYe'; recentlyShowList = []; load(1) 
      }">专业文</tab-item>
    </vux-tab>

    <view-box class="com-tab-view recentlyList" :body-padding-bottom="0" v-if="selected == 'recently'">
      <vux-group class="com-group-noMarginTop">
        <article-item v-for="(item, index) in recentlyShowList" :key="index" :ret="item"
          @click.native="toArticle(item)"
        ></article-item>
      </vux-group>
    </view-box>

    <div class="search-bar" v-if="selected !== 'recently'">
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

    <catalog-item :catalogs="illLists" class="menu"></catalog-item>
  </div>
</template>

<script>
import { Tab, TabItem, ViewBox } from 'vux'
import ArticleItem from '@c/item/ArticleItem'
import CatalogItem from '@c/Catalog/CatalogGroup'

// 这是一个类，用来树化疾病目录
import List from './list' 
export default {
  components: {
    VuxTab: Tab, TabItem, ViewBox,
    ArticleItem, CatalogItem
  },

  data (){
    return {
      kePu_List: [],
      zhuanYe_List: [],
      recentlyShowList: [],
      status: 'init',
      selected: 'init',
      typeSelected: 'init',
      visibleTypeTabs: true,

      keyword: '',
      illLists: [],
      showillList: []
    }
  },

  mounted (){
    this.$refs.firstTab.$el.click()
    this.$refs.typeFirstTab.$el.click()
    this.load()
  },

  computed: {
    baseIllList (){
      return this.$store.getters['baseIllList/plain']
    }
  },

  watch: {
    selected (val){
      if(this.baseIllList.map(val => val.id).includes(val)){
        this.loadillList(val)
      }
    }
  },

  methods: {
    load (type = 2){
      if(type === 1 && this.zhuanYe_List.length){
        this.recentlyShowList = this.zhuanYe_List
        return
      }
      if(type === 2 && this.kePu_List.length){
        this.recentlyShowList = this.kePu_List        
        return
      }

      this.$bus.$emit('vux.spinner.show')
      this.status = 'loading'
      _request({
        url: 'article/newArticleList',
        params: { style: type }
      }).then(({data}) =>{
        this.$bus.$emit('vux.spinner.hide')
        if(data.result){
          this.status = 'success'
          if(type === 1){
            this.zhuanYe_List = data.ret.data
            if(this.typeSelected === 'zhuanYe'){
              this.recentlyShowList = this.zhuanYe_List
            }
          }
          if(type === 2){
            this.kePu_List = data.ret.data
            if(this.typeSelected === 'kePu'){
              this.recentlyShowList = this.kePu_List
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
          type: this.typeSelected
        }
      })
    },

    loadillList (ill_id){
      _request({
        url: 'article/mulu',
        params: { ill_id }
      }).then(({data}) =>{
        if(data.result){
          var list = new List(data.ret)
          this.illLists = list.toTree()
        }
      })
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

.recentlyList{
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

.menu{
  position: relative;
  left: -15px;
}
</style>
