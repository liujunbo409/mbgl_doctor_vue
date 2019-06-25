<template>
  <div class="com-container">
    <vue-header title="审核问答"></vue-header>
    <vux-tab :animate="false">
      <tab-item ref="firstTab" @click.native="selected = 'wait'">待审核</tab-item>
      <tab-item @click.native="selected = 'already'">已审核</tab-item>
    </vux-tab>

    <view-box class="com-tab-view" v-if="selected == 'wait'">
      <assess-item v-for="(item, index) in (waitList || [])" :key="index" :title="item.qa.question" :status="item.status"
       @click.native="toAssessContent(item)"
      ></assess-item>
    </view-box>

    <view-box class="com-tab-view" v-else>
      <assess-item v-for="(item, index) in (alreadyList || [])" :key="index" :title="item.qa.question" :status="item.status"
      @click.native="toArticleDetails(item)"
      ></assess-item>
    </view-box>

    <div class="com-noData" style="top:90px" v-if="
      (selected === 'wait' && waitList && !waitList.length) ||
      (selected === 'already' && alreadyList && !alreadyList.length)
    ">暂无数据</div>
  </div>
</template>

<script>
import { Tab, TabItem } from 'vux'
import AssessItem from '@c/item/AssessItem'
export default {
  components: {
    VuxTab: Tab, TabItem,
    AssessItem
  },

  data (){
    return {
      waitList: null, //待审核列表
      alreadyList: null, //已审核列表
      selected: 'wait', // 俩个列表切换
    }
  },

  mounted (){
    // 默认点击
    this.$refs.firstTab.$el.click()
  },

  activated (){
    this.getWaitList()
    this.getAlreadyList()
  },

  methods: {
     // 获取待审核列表
    getWaitList (){
      // this.waitStatus = 2
      this.$bus.$emit('vux.spinner.show')
      _request({
        url: 'qa/shenhe/waitList',
        params: {
          role: this.$store.state.user.userInfo.role
        }
       }).finally(() => this.$bus.$emit('vux.spinner.hide'))
       .then(({data}) =>{
         if(data.result){
           this.waitList = data.ret.data
           console.log(this.waitList)
         }else{
           this.$bus.$emit('vux.toast', data.message)
         }
       })
    },

     // 已审核列表
    getAlreadyList (){
        this.$bus.$emit('vux.spinner.show')
      _request({
        url: 'qa/shenhe/alreadyList',
        params: {
          role: this.$store.state.user.userInfo.role
        }
       }).finally(() => this.$bus.$emit('vux.spinner.hide'))
       .then(({data}) =>{
         if(data.result){
           this.alreadyList = data.ret.data
         }else{
           this.$bus.$emit('vux.toast', data.message)
         }
       })
    },

    // 去AssessInfo页  data是传过去的数据
    toAssessContent (data){
      this.$toView('review_qa/assess_info', {
        params:{
          data
        }  
      })
    },

    // 去ArticleDetails  data是传过去的数据
    toArticleDetails(data) {
      this.$toView('review_qa/assess_result',{
        params:{
          data
        }  
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>
