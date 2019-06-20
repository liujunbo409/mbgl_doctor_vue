<template>
  <div class="com-container">
    <vue-header title="我的提问"></vue-header>
    <inline-loading v-if="illListStatus === 2"></inline-loading>
    <template v-if="illListStatus === 3">
      <vux-tab :animate="false">
        <tab-item ref="firstTab" @click.native="selected = 'answeredList'">我回答的</tab-item>
        <tab-item @click.native="selected = 'likedList'">我赞同的</tab-item>
        <tab-item @click.native="selected = 'commentedList'">我评论的</tab-item>
      </vux-tab>
      <div class="hint">浏览提问</div>
      <div class="selectorBar">
        <select v-model="selectedIll" class="illSelector">
          <option value="">全部疾病</option>
          <option v-for="(option, index) in illList" :key="index"
            :value="option.id"
          >{{ option.name }}</option>
        </select>
        <select v-model="selectedMode" class="modeSelector">
          <option value="created_at">按时间排序</option>
          <option value="approved_num">按热度排序</option>
        </select>
      </div>

      <view-box minus="153px">
        <template v-if="$data[selected]">
          <answer-item v-for="(item, index) in $data[selected].data" :key="index"
            :data="item"
            @click.native="toAnswerInfo(item)"
          ></answer-item>
        </template>
      </view-box>

      <page-selector v-if="$data[selected]"
        :nowPage="$data[selected].current_page || '...'"
        :pageCount="Math.ceil($data[selected].total / 10)"
        @onClickLeft="jumpPage(-1)"
        @onClickRight="jumpPage(1)"
      ></page-selector>
      
      <keep-alive>
        <router-view class="com-modal"></router-view>
      </keep-alive>
    </template>
  </div>
</template>

<script>
import { Tab, TabItem } from 'vux'
import PageSelector from '@c/block/PageSelector'
import AnswerItem from '@c/item/AnswerItem'

export default {
  components: {
    VuxTab: Tab, TabItem,
    PageSelector, AnswerItem
  },

  data (){
    return {
      selected: '',   // 选中的tab
      selectedIll: '',
      selectedMode: 'created_at',
      illList: [],
      illListStatus: 1,
      
      answeredList: null,
      likedList: null,
      commentedList: null
    }
  },

  mounted (){
    this.loadIllList().then(() =>{
      this.$refs.firstTab.$el.click()
    })
  },

  watch: {
    selected (){
      this.getList()
    },

    selectedIll (){
      this.getList(true)
    },

    selectedMode (){
      this.getList(true)
    }
  },

  methods: {
    loadIllList (){
      return new Promise((resolve, reject) =>{
        this.illistStatus = 2
        _request({
          url: 'apply/doctorIll',
          params: {
            role: this.$store.state.user.userInfo.role
          }
        }).then(({data}) =>{
          if(data.result){
            this.illListStatus = 3
            this.illList = data.ret
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

    getList (force = false){
      var apiName = {
        answeredList: 'Answer',
        likedList: 'Attention',
        commentedList: 'Comment'
      }[this.selected]

      if(this[this.selected] && !force){ return }

      this.$vux.loading.show()
      _request({
        url: `openquiz/my${apiName}OpenQuiz`,
        params: {
          page_size: 10,
          orderby: this.selectedMode,
          ill_id: this.selectedIll
        }
      }).finally(this.$vux.loading.hide)
      .then(({data}) =>{
        if(data.result){
          this[this.selected] = data.ret
        }else{
          this.$bus.$emit('vux.toast', data.message)
        }
      })
    },

    jumpPage (){

    },

    toAnswerInfo (data){
      this.$toView('my_question/answer_info', {
        params: {
          data: data.openquiz,
          id: data.id,
          illId: data.illId
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.hint{
  line-height: 39px;
  text-align: center;
  background-color: white;
  border-bottom: 1px #666 solid;
}

.selectorBar{
  width: 100%;
  height: 39px;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  padding: 0 10px;
  display: flex;
  border-bottom: 1px #666 solid;

  select{
    border: none;
    appearance: none;
    font-size: 16px;
    outline: none;
  }

  .modeSelector{
    margin-right: 20px;
  }
}
</style>
