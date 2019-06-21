<template>
  <div class="com-container">
    <vue-header title="公开提问"></vue-header>
    <view-box>
      <inline-loading v-if="questionStatus === 2"></inline-loading>
      <template v-if="questionStatus === 3">
        <header>
          <p class="title">{{ questionData.title }}</p>
          <div class="content">{{ questionData.content }}</div>
          <div class="info">
            <span class="answerCount">{{ questionData.answer_num }}个回答</span>
            <span class="attentionCount">{{ questionData.attention_num }}人关注</span>
            <span class="date">{{ questionData.created_at | date }}</span>
            <div class="writeAnswerBtn" :class="{ answered: questionData.have_myself_answer }"
              @click="onClickHeaderAnswerBtn"
            >{{ questionData.have_myself_answer ? '查看我的回答' : '写回答' }}</div>
          </div>
        </header>

        <div class="answerList-container" v-if="answerTree.length">
          <answer-item v-for="(item, index) in answerTree" :key="index"
            :data="item" 
            @click.native="$toView('all_qa/qa_info/answer_info', 
            { params: { data: questionData, id: item.id, illId } })"
          ></answer-item>
        </div>
        <div class="noAnswer" v-else>暂无回答</div>
      </template>
    </view-box>

    <keep-alive>
      <router-view class="com-modal"></router-view>
    </keep-alive>
  </div>
</template>

<script>
import AnswerItem from '@c/item/AnswerItem'
import List from '@u/list.js'

export default {
  components: {
    AnswerItem
  },

  data (){
    return {
      qaId: '',
      illId: '',
      questionData: null,
      answerData: null,
      questionStatus: 1,
      answerStatus: 1
    }
  },

  activated (){
    if(this.$route.query.qaId){
      this.qaId = this.$route.query.qaId
      this.illId = this.$route.query.illId
    }

    this.loadQuestionData()
    this.loadAnswer()
  },

  computed: {
    // 扁平数据转化为树
    answerTree (){
      if(!this.answerData){
        return []
      }else{
        return new List(this.answerData.data).toTree()
      }
    }
  },

  methods: {
    // 载入提问数据
    loadQuestionData (){
      this.questionStatus = 2
      _request({
        url: 'openquiz/getDetails',
        params: {
          quiz_id: this.qaId
        }
      }).then(({data}) =>{
        if(data.result){
          this.questionStatus = 3
          this.questionData = data.ret
        }else{
          this.questionStatus = 0
          this.$bus.$emit('vux.toast', data.message)
        }
      }).catch(e =>{
        this.questionStatus = 0
        console.log(e)
        this.$bus.$emit('vux.toast', {
          type: 'cancel',
          text: '网络错误'
        })
      })
    },

    // 载入回答数据
    loadAnswer (){
      _request({
        baseURL: 'http://de.lljiankang.top/api/user/',
        url: 'openquiz/getAnswer',
        params: {
          quiz_id: this.qaId
        }
      }).then(({data}) =>{
        if(data.result){
          this.answerData = data.ret
        }else{
          this.$bus.$emit('vux.toast', data.message)
        }
      })
    },

    // 点击头部右侧的按钮（写回答/显示我的回答）
    onClickHeaderAnswerBtn (){
      if(this.questionData.have_myself_answer){
        this.$toView('all_qa/qa_info/answer_info', {
          params: {
            data: this.questionData,
            id: this.questionData.have_myself_answer,
            illId: this.illId
          }
        })
      }else{
        this.$toView('all_qa/qa_info/answer_editor', {
          params: {
            data: this.questionData, 
            illId: this.illId 
          } 
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
header{
  background-color: white;
  padding: 10px;
  border-bottom: 5px #ccc solid;


  .title, .content{
    padding-left: 10px;
  }

  .title{
    font-size: 20px;
  }

  .content{
    font-size: 16px;
  }

  .info{
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
    flex-wrap: wrap;

    @media screen and (max-width: 330px){
      font-size: 12px;
    }

    > *{
      white-space: nowrap;
    }

    .writeAnswerBtn{
      height: 30px;
      box-sizing: border-box;
      background-color: white;
      text-align: center;
      display: inline-block;
      padding: 5px 10px;
      border: 1px #aaa solid;
      border-radius: 5px;
      white-space: nowrap;
      

      &:not(.answered){
        &::before{
          content: '';
          display: inline-block;
          background-image: url('~@img/btn/pen.png');
          background-repeat: no-repeat;
          background-size: 100%;
          width: 1em;
          height: 1em;
          vertical-align: sub;
          vertical-align: -1px;
          margin-right: 2px;
        }
      }
    }
  }
}

.noAnswer{
  line-height: 40px;
  font-size: 18px;
  text-align: center;
  background-color: white;
}
</style>
