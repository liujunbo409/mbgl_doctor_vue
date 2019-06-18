<template>
  <div class="com-container">
    <vue-header title="审核文章"></vue-header>
    <vux-tab :animate="false">
      <tab-item ref="firstTab" @click.native="selected = 'wait'">待审核</tab-item>
      <tab-item @click.native="selected = 'resolved'">已审核</tab-item>
    </vux-tab>
    <view-box class="com-tab-view" v-if="selected == 'wait'">
      <assess-item v-for="({title, id, shenHe_Id}, index) in waitList" :title="title" :key="index"
        @click.native="toAssessContent(id, shenHe_Id)"
      ></assess-item>
    </view-box>
    <view-box class="com-tab-view" :paddingBottom="0" v-else>
      <assess-item v-for="({title, id, status, remark}, index) in resolvedList" :title="title" :key="index"
        :status="status"
        @click.native="toAssessInfo(id, remark, status)"
      ></assess-item>
    </view-box>
    <div class="com-ab-center com-reloadBtn"
      @click="selected === 'wait' ? getWaitList : getResolvedList"
      v-if="(status === 'waitError' && selected === 'wait') || (status === 'resolvedError' && selected === 'resolved')"
    >重新加载</div>
    <div class="noExists" v-if="
      (!waitList.length && status === 'success' && selected === 'wait') ||
      (!resolvedList.length && status === 'success' && selected === 'resolved')
    "
    ></div>
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
      waitList: [],
      resolvedList: [],
      selected: 'wait',
      status: 1,
      
    }
  },

  mounted (){
    // 默认选中第一个
    this.$refs.firstTab.$el.click()
    // 初始化两个列表
    this.getWaitList()
    this.getResolvedList()
  },

  methods: {
    // 获取待审核列表
    getWaitList (){
      this.status = 2
      this.$bus.$emit('vux.spinner.show')
      _request({
        url: 'article/shenhe/waitList',
        params: {
          role: this.$store.state.user.userInfo.role
        }
      }).then(({data}) =>{
        this.$bus.$emit('vux.spinner.hide')
        if(data.result){
          this.status = 3
          if(!data.ret.data.length){ return }
          console.log(data.ret.data)
          this.waitList = data.ret.data.map(val =>{
            var {id, title} = val.article
            return { id, title, shenHe_Id: val.id }
          })
        }else{
          this.status = 'waitError'
        }
      }).catch(e =>{
        this.status = 'waitError'
        this.$bus.$emit('vux.spinner.hide')
        console.log(e)
        this.$bus.$emit('vux.toast', {
          type: 'cancel',
          text: '网络错误'
        })
      })
    },

    // 获取已审核列表
    getResolvedList (){
      this.status = 2
      this.$bus.$emit('vux.spinner.show')
      _request({
        url: 'article/shenhe/already',
        params: {
          role: this.$store.state.user.userInfo.role
        }
      }).then(({data}) =>{
        this.$bus.$emit('vux.spinner.hide')
        if(data.result){
          this.status = 3
          if(!data.ret.data.length){ return }
          this.resolvedList = data.ret.data.map(val =>{
            var {article_id: id, name: title, status, remark} = val
            return { id, title, status, remark }
          })
        }else{
          this.status = 'resolvedError'
        }
      }).catch(e =>{
        this.status = 'resolvedError'
        this.$bus.$emit('vux.spinner.hide')
        console.log(e)
      })
    },

    // 前往文章审核页面
    toAssessContent (id, shenHe_Id){
      this.$toView('assess_content', {
        params: { id, shenHe_Id }
      })
    },

    // 前往文章已审核详情页面
    toAssessInfo (id, remark, status){
      this.$toView('assess_info', {
        params: { id, remark, status }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.com-reloadBtn{
  color: @theme;
  font-size: 18px;
}

.noExists{
  width: 100%;
  height: 100%;
  background-color: #eee;
  color: #666;
  font-size: 26px;
  position: fixed;
  top: 0;
  left: 0;
  text-align: center;

  &::after{
    content: '暂无记录';
    display: block;
    position: relative;
    top: ~'calc(50% + 45px)';
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
