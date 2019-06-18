<template>
  <div class="com-container">
    <vue-header title="公开提问"></vue-header>
    <inline-loading v-if="questionStatus === 2"></inline-loading>
    <template v-if="questionStatus === 3">
      <header>
        <p class="title">{{ questionData.title }}</p>
        <div class="content">{{ questionData.content }}</div>
        <div class="info">
          <span class="answerCount">{{ questionData.answer_num }}个回答</span>
          <span class="attentionCount">{{ questionData.attention_num }}人关注</span>
          <span class="date">{{ questionData.created_at }}</span>
          <div class="attentionBtn">{{ '写回答' }}</div>
        </div>
      </header>
    </template>
  </div>
</template>

<script>
export default {
  data (){
    return {
      qaId: '',
      questionData: {},
      answerData: {},
      questionStatus: 1,
      answerStatus: 1
    }
  },

  activated (){
    if(this.$route.query.qaId){
      this.qaId = this.$route.query.qaId
    }
    this.loadQuestionData()
  },

  methods: {
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

    .attentionBtn{
      width: 70px;
      height: 30px;
      box-sizing: border-box;
      background-color: @theme;
      color: white;
      text-align: center;
      display: inline-block;
      padding: 5px 10px;
      border-radius: 5px;
      white-space: nowrap;

      &::before{
        content: '+ ';
        display: inline;
        font-size: 22px;
        line-height: 14px;
        vertical-align: -2px;
      }

      &.followed{
        .themeBtn;

        &::before{
          content: '- ';
        }
      }
    }
  }
}
</style>
