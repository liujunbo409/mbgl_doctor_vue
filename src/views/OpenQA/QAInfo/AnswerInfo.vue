<template>
  <div class="com-container">
    <vue-header title="问题详情"></vue-header>
    <template v-if="questionData && answerData">
      <view-box minus="50px">
        <header>
          <p class="title">{{ questionData.title }}</p>
          <div class="content">{{ questionData.content }}</div>
          <div class="info">
            <span class="answerCount">{{ questionData.answer_num }}个回答</span>
            <span class="attentionCount">{{ questionData.attention_num }}人关注</span>
            <span class="date">{{ questionData.created_at | date }}</span>
            <div class="writeAnswerBtn" :class="{ answered: questionData.have_myself_answer }"
              @click="onClickHeaderAnswerBtn"
            >
              {{ questionData.have_myself_answer ? '查看我的回答' : '写回答' }}
            </div>
          </div>
        </header>

        <main>
          <div class="doctorInfo">
            <img src="@img/sub/doctor_icon.png" class="icon">
            <div class="info">
              <p class="realName">{{ answerData.role_name + role }}</p>
              <div class="zhi_cheng">{{ answerData.role_title_str }}</div>
            </div>
          </div>     
          <div class="content">{{ answerData.content }}</div>
          <div class="nextAnswerBtn" @click="nextAnswer">下一个回答</div>
        </main>
      </view-box>
      <footer>
        <span class="thankCount">{{ answerData.thank_num }}个感谢</span>
        <div class="btn">
          <img src="@img/btn/good_fill.png">
          <!-- <img src="@img/btn/good.png"> -->
          <p>赞同 {{ answerData.like_num }}</p>
        </div>

        <div class="btn" @click="showCommentEditor">
          <img src="@img/btn/comment.png">
          <p>评论 {{ answerData.comment_num }}</p>
        </div>
      </footer>
    </template>

    <keep-alive>
      <router-view class="com-modal"></router-view>
    </keep-alive>
  </div>
</template>

<script>
export default {
  data (){
    return {
      questionData: null,
      answerId: '',
      illId: '',
      answerData: null
    }
  },

  activated (){
    if(this.$route.params.data){
      this.questionData = this.$route.params.data
      this.answerId = this.$route.params.id
      this.illId = this.$route.params.illId
    }
  },

  computed: {
    role (){
      return {
        doctor: '医生',
        nurse: '护士'
      }[this.answerData.role]
    },
  },

  watch: {
    answerId (){
      this.getComments()
    },

    $route (route){
      if(route.name === 'all_qa/qa_info/answer_info'){
        this.getComments()
      }
    }
  },

  methods: {
    onClickHeaderAnswerBtn (){
      if(this.questionData.have_myself_answer){
        if(this.answerId === this.questionData.have_myself_answer){
          this.$bus.$emit('vux.toast', '该条已经是您的回答')
          return
        }

        this.id = this.questionData.have_myself_answer
      }else{
        this.$toView('all_qa/qa_info/answer_editor', {
          params: {
            data: this.questionData, 
            illId: this.illId 
          } 
        })
      }
    },

    getComments (){
      this.$vux.loading.show()
      _request({
        url: 'openquiz/getOneAnswer',
        params: {
          answer_id: this.answerId
        }
      }).finally(this.$vux.loading.hide)
      .then(({data}) =>{
        if(data.result){
          this.answerData = data.ret
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

    nextAnswer (){
      if(!this.answerData.next_answer_id){
        this.$bus.$emit('vux.toast', '已经是最后一条回答')
      }else{
        this.answerId = this.answerData.next_answer_id
      }
    },

    showCommentEditor (){
      this.$toView('all_qa/qa_info/answer_info/commentEditor', {
        params: {
          quizId: this.answerData.quiz_id,
          illId: this.illId,
          fatherId: this.answerData.id,
          name: this.answerData.role_name
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
header{
  background-color: white;
  padding: 10px;

  .title{
    font-size: 16px;
    margin-bottom: 5px;
    margin-left: 5px;
  }

  .info{
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-around;
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

main{
  margin-top: 10px;
  background-color: white;
  padding: 10px;
  color: #666;

  .doctorInfo{
    width: 100%;
    display: flex;

    .icon{
      width: 40px;
      border-radius: 50%;
      margin-right: 10px;
    }

    .zhi_cheng{
      color: #aaa;
    }
  }

  .content{
    margin: 10px 10px 10px 0;
  }

  .nextAnswerBtn{
    display: table;
    padding: 10px 15px;
    background-color: #eee;
    border-radius: 25px;
    font-size: 16px;
    margin-left: auto;
  }
}

footer{
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: white;

  .btn{
    text-align: center;

    > img{
      width: 25px;
      vertical-align: middle;
    }
  }
}
</style>
