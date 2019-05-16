<template>
  <div class="com-container">
    <vue-header title="全部文章"></vue-header>
    <vux-tab :animate="false">
      <tab-item ref="firstTab" @click.native="selected = 'recently'">最近更新</tab-item>
      <tab-item @click.native="selected = 'tang_niao_bing'">糖尿病</tab-item>
      <tab-item @click.native="selected = 'tong_feng'">痛风</tab-item>
      <tab-item @click.native="selected = 'yao_zhui_bing'">腰椎病</tab-item>
      <tab-item @click.native="selected = 'jing_zhui_bing'">颈椎病</tab-item>
    </vux-tab>

    <vux-tab :animate="false" v-if="visibleTypeTabs">
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

    <div class="com-reloadBtn com-ab-center"
      v-if="
        (status === 'error1' && typeSelected === 'zhuanYe') ||
        (status === 'error2' && typeSelected === 'kePu')
      "
      @click="load(status.split('error')[1])"
    >重新加载</div>
  </div>
</template>

<script>
import { Tab, TabItem, ViewBox } from 'vux'
import ArticleItem from '@c/item/ArticleItem'

export default {
  components: {
    VuxTab: Tab, TabItem, ViewBox,
    ArticleItem
  },

  data (){
    return {
      kePu_List: [],
      zhuanYe_List: [],
      recentlyShowList: [],
      status: 'init',
      selected: 'init',
      typeSelected: 'init',
      visibleTypeTabs: true
    }
  },

  mounted (){
    this.$refs.firstTab.$el.click()
    this.$refs.typeFirstTab.$el.click()
    this.load()
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
        this.bus.emit('vux.toast', {
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
    }
  }
}
</script>

<style lang="less" scoped>
.scrollable .vux-tab-item{
  flex: 0 0 20%;
}

.recentlyList{
  max-height: calc(~'100% - 90px - 44px');   // 减去上栏 + 两个tab高度
}
</style>
