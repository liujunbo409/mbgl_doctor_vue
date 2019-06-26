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

        <div class="comments" v-if="comments.length">
          <h2>评论</h2>
          <vue-comments :data="comments" :illId="illId" @update="getComments(false)"></vue-comments>
        </div>
        <div class="noComments" v-else>暂无评论</div>

      </view-box>
      <footer>
        <span class="thankCount">{{ answerData.thank_num }}个感谢</span>
        <div class="btn" @click="toggleAttention">
          <img src="@img/btn/good_fill.png" v-if="answerData.approved_status">
          <img src="@img/btn/good.png" v-else>
          <p>赞同 {{ answerData.approved_num }}</p>
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
import VueComments from '@c/Comments/Comments'
import List from '@u/list.js'

export default {
  components: {
    VueComments
  },

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

    comments (){
      return new List(this.answerData.comment_list).toTree()
    }
  },

  watch: {
    answerId (){
      this.getComments()
    },

    $route (route){
      if(route.name === 'all_qa/qa_info/answer_info'){
        this.getComments(false)
      }
    }
  },

  methods: {
    // 点击头部右侧的按钮（写回答/显示我的回答）
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

    // 获取评论
    getComments (showLoading = true){
      showLoading && this.$vux.loading.show()
      _request({
        url: 'openquiz/getOneAnswer',
        params: {
          answer_id: this.answerId
        }
      }).finally(() => showLoading && this.$vux.loading.hide())
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

    // 下个回答
    nextAnswer (){
      if(!this.answerData.next_answer_id){
        this.$bus.$emit('vux.toast', '已经是最后一条回答')
      }else{
        this.answerId = this.answerData.next_answer_id
      }
    },

    // 显示评论编辑器（路由模态框）
    showCommentEditor (){
      this.$toView('all_qa/qa_info/answer_info/commentEditor', {
        params: {
          quizId: this.answerData.quiz_id,
          illId: this.illId,
          fatherId: this.answerData.id,
          name: this.answerData.role_name
        }
      })
    },

    // 切换赞同状态
    toggleAttention (){
      this.$vux.loading.show()
      _request({
        url: 'openquiz/approved',
        method: 'post',
        data: {
          quiz_id: this.questionData.id,
          type: this.answerData.approved_status ? 0 : 1,
          ill_id: this.illId,
          answer_id: this.answerData.id
        }
      }).finally(this.$vux.loading.hide)
      .then(({data}) =>{
        if(data.result){
          this.answerData.approved_status = !this.answerData.approved_status
          this.answerData.approved_num += this.answerData.approved_status ? 1 : -1
          this.$bus.$emit('vux.toast', this.answerData.approved_status ? '已赞同' : '已撤销赞同')
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

.comments{
  background-color: white;
  margin-top: 10px;

  h2{
    font-size: 18px;
    font-weight: normal;
    text-indent: 10px;
    padding-top: 10px;
    line-height: 30px;
  }
}

.noComments{
  line-height: 40px;
  font-size: 18px;
  text-align: center;
  background-color: white;
  margin-top: 10px;
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
