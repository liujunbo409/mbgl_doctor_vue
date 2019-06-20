<template>
  <div class="com-container">
    <vue-header title="公开提问"></vue-header>
    <inline-loading v-if="illListStatus === 2"></inline-loading>
    <template v-if="illListStatus === 3">
      <div class="tabs-container">
        <vux-tab :animate="false" class="tabs">
          <tab-item ref="firstTab" @click.native="selected = 'recent'">最近更新</tab-item>
          <tab-item v-for="({name, id}, index) in selectedIllList" :key="index"
            :ref="`tab-${id}`"
            @click.native="selected = id"
          >{{ name }}</tab-item>
        </vux-tab>
        <!-- <span class="moreIllBtn" @click="$toView('open_qa/all_ill', { params: { selectedIllList } })"></span> -->
      </div>

      <div class="com-input-container" v-if="selected !== 'recent'">
        <input type="text" v-model.trim="keyword" placeholder="请输入要搜索的问题">
        <x-icon type="ios-search-strong" size="30" @click="getQAList(1, keyword)"></x-icon>
      </div>

      <view-box :minus="`${154 - (selected === 'recent' ? 37 : 0)}px`" class="list-container" ref="list">
        <vux-group class="com-group-noMarginTop">
          <vux-cell v-for="(item, index) in (QAData[selected] ? QAData[selected].data : [])" :key="index"
            :title="item.title"
            :inline-desc="`${item.answer_num}个回答　${item.attention_num}人关注`"
            :value="item.created_at.split(' ')[0]"
            @click.native="$toView('open_qa/qa_info', { query: { qaId: item.id, illId: item.ill_id } })"
          ></vux-cell>
        </vux-group>
      </view-box>

      <page-selector v-if="QAData[selected]"
        :nowPage="QAData[selected].current_page || '...'"
        :pageCount="Math.ceil(QAData[selected].total / 10)"
        @onClickLeft="jumpPage(-1)"
        @onClickRight="jumpPage(1)"
      ></page-selector>

      <footer @click="toQuestion">
        <img src="@img/btn/edit.png">
        <span>我要提问</span>
      </footer>
    </template>
  </div>
</template>

<script>
import { Tab, TabItem } from 'vux'
import PageSelector from '@c/block/PageSelector'
export default {
  components: {
    VuxTab: Tab, TabItem,
    PageSelector
  },

  data (){
    return {
      selected: '',
      selectedIllList: [],
      illListStatus: 1,
      QAData: {},     // 问题数据
      keyword: ''
    }
  },

  activated (){
    this.loadSelectedIllList().then(() =>{
      this.$refs.firstTab.$el.click()
    })
  },

  computed: {

  },

  watch: {
    selected (){
      this.getQAList()
    }
  },

  methods: {
    // 获取已选疾病列表
    loadSelectedIllList (){
      return new Promise((resolve, reject) =>{
        this.illListStatus = 2
        console.log(this.$store.state.user.userInfo.role)
        _request({
          url: 'apply/doctorIll',
          params: {
            role: this.$store.state.user.userInfo.role
          }
        }).then(({data}) =>{
          if(data.result){
            this.illListStatus = 3
            this.selectedIllList = data.ret
            resolve()
          }else{
            this.illListStatus = 0
            this.$bus.$emit('vux.toast', data.message)
            reject()
          }
        }).catch(e =>{
          this.illListStatus = 0
          console.log(e)
          this.$bus.$emit('vux.toast', {
            type: 'cancel',
            text: '网络错误'
          })
          reject()
        })
      })
    },

    // 请求问答列表
    getQAList (page = 1, keyword){
      if(this.QAData[this.selected] && (page > this.QAData[this.selected].last_page)){
        this.$bus.$emit('vux.toast', '已经是最后一页')
        return
      }
      if(page < 1){
        this.$bus.$emit('vux.toast', '已经是第一页')
        return
      }      

      this.$bus.$emit('vux.spinner.show')
      
      // 这里要用到三个接口
      var url = 'openquiz/recentList'   // 最近更新
      if(this.selected !== 'recent'){
        url = 'openquiz/getListByIll'   // 按疾病全部
      }
      if(keyword){
        url = 'openquiz/getListBySearch'    // 按疾病搜索
      }
      _request({
        url,
        params: {
          ill_id: this.selected,
          page_size: 10,
          page,
          search_word: keyword
        }
      })
      .finally(() => this.$bus.$emit('vux.spinner.hide'))
      .then(({data}) =>{
        if(data.result){
          Vue.set(this.QAData, this.selected, data.ret)
        }else{
          this.$bus.$emit('vux.toast', data.message)
        }
      }).catch(e =>{
        console.log(e)
        this.$bus.$emit('vux.toast', {
          type: 'cancel',
          text: '网络错误'
        })
      })
    },

    // 切换页面
    jumpPage (num){
      this.getQAList(this.QAData[this.selected].current_page + num)
      Vue.nextTick(() => this.$refs.list.scrollTo(0))
    },

    toQuestion (){
      if(this.selected === 'recent'){
        this.$toView('open_qa/all_ill', { params: { selectedIllList: this.selectedIllList } })
        this.$bus.$emit('vux.toast', '请先选择要提问的疾病')
      }else{
        this.$toView('open_qa/question', {
          params: {
            ill: this.selectedIllList.filter(val => val.ill_id === this.selected)[0]
          }
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.tabs-container{
  position: relative;

  // 为更多疾病按钮让出空间
  // .tabs{
  //   margin-right: 44px;
  // }
}

.moreIllBtn{
  background-image: url('~@img/btn/menu.png');
  background-size: 90%;
  background-repeat: no-repeat;
  background-position: center 4px;

  @size: 43px;
  width: @size;
  height: @size;
  position: absolute;
  top: 0;
  right: 0;
  background-color: white;
  box-shadow: -2px -1px 2px #666;
}

.com-input-container{
  background-color: #eee;
  height: 35px;
  border-bottom: 2px #ccc solid;
  display: flex;
  align-items: center;

  > input{
    padding: 5px;
  }
}

.list-container{
  background-color: white;

  /deep/ .weui-cell__ft{
    height: 48px;
  }
}

footer{
  @height: 44px;
  height: @height;
  line-height: @height;
  background-color: @theme;
  font-size: 20px;
  text-align: center;
  color: white;

  > img{
    width: 25px;
    vertical-align: text-top;
    margin-right: 5px;
  }
}
</style>
