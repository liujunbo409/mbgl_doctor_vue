<template>
  <div class="com-container" @click.self="$router.back()">
    <main>
      <p class="hint">评论给 {{ targetName }}</p>
      <vux-group class="com-group-noMarginTop">
        <x-textarea v-model="comment" placeholder="请输入评论内容" :max="100" class="textarea"></x-textarea>
        <div class="footer">
          <span class="submitBtn" @click="submit">发布</span>
        </div>
      </vux-group>
    </main>
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
      quizId: '',
      illId: '',
      comment: '',
      targetName: '',
      fatherId: ''
    }
  },

  activated (){
    if(this.$route.params.quizId){
      this.quizId = this.$route.params.quizId
      this.illId = this.$route.params.illId
      this.targetName = this.$route.params.name
      this.fatherId = this.$route.params.fatherId
    }
  },

  methods: {
    // 提交
    submit (){
      if(!this.comment){
        this.$bus.$emit('vux.toast', '评论内容不能为空')
        return
      }

      _request({
        url: 'openquiz/answer',
        method: 'post',
        data: {
          quiz_id: this.quizId,
          content: this.comment,
          father_id: this.fatherId,
          ill_id: this.illId
        }
      }).then(({data}) =>{
        if(data.result){
          this.comment = ''
          this.$bus.$emit('vux.toast', {
            type: 'success',
            text: '评论成功'
          })
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
.com-container{
  background-color: rgba(0, 0, 0, 0.3);
}
main{
  background-color: white;
  border: 1px #ccc solid;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;

  .hint{
    font-size: 16px;
    padding: 5px 20px;
  }

  .textarea{
    /deep/ .weui-textarea-counter{
      text-align: left;
      margin-left: 10px;
      margin-bottom: 5px;
    }

    /deep/ .weui-textarea{
      box-sizing: border-box;
      padding: 5px;
    }

    /deep/ .weui-cell__bd{
      border: 1px #666 solid;
    }
  } 

  .footer{
    padding: 0 10px 10px 10px;
    text-align: right;

  
    .submitBtn{
      margin-right: 10px;
    }
  }
}
</style>
