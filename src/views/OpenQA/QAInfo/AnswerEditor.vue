<template>
  <div class="com-container">
    <vue-header title="问题详情"></vue-header>
    <view-box minus="40px" v-if="questionData">
      <header>
        <p class="title">{{ questionData.title }}</p>
        <div class="content">{{ questionData.content }}</div>
        <div class="info">
          <span class="answerCount">{{ questionData.answer_num }}个回答</span>
          <span class="attentionCount">{{ questionData.attention_num }}人关注</span>
          <span class="date">{{ questionData.created_at | date }}</span>
        </div>
      </header>
      <vux-group class="com-group-noMarginTop textarea">
        <x-textarea v-model.trim="answerContent"
          placeholder="请输入您的回答内容" :max="500"
          :autosize="true"
        ></x-textarea>
      </vux-group>
    </view-box>
    <footer class="submitBtn" @click="submit">回答</footer>
  </div>
</template>

<script>
import { XTextarea } from 'vux'
export default {
  components: {
    XTextarea
  },

  data (){
    return {
      questionData: null,
      illId: '',
      answerContent: ''
    }
  },

  activated (){
    if(this.$route.params.data){
      this.questionData = this.$route.params.data
      this.illId = this.$route.params.illId
    }
  },

  methods: {
    // 提交回答
    submit (){
      if(!this.answerContent){
        this.$bus.$emit('vux.toast', '回答不能为空')
        return
      }
      
      this.$vux.loading.show()
      _request({
        url: 'openquiz/answer',
        method: 'post',
        data: {
          quiz_id: this.questionData.id,
          content: this.answerContent,
          father_id: 0,
          ill_id: this.illId
        }
      }).finally(this.$vux.loading.hide)
      .then(({data}) =>{
        if(data.result){
          this.$bus.$emit('vux.alert', '提交回答成功')
          this.$router.back()
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
    > *{
      margin-left: 5px;
    }
  }
}

.textarea{
  border-top: 2px #ccc solid;
}

.submitBtn{
  @height: 40px;
  height: @height;
  line-height: @height;
  text-align: center;
  .themeBtn;
}
</style>
