<template>
  <div class="comment-box">
    <img src="#" class="icon">
    <p class="name">{{ data.role_name }}</p>
    <div class="content">{{ data.content }}</div>
    <footer>
      <span>{{ data.created_at_easy }}</span>
      <span @click="dian_Zan">
        <img src="@img/btn/good_fill.png" v-if="data.like_status">
        <img src="@img/btn/good.png" v-else>
        <span>{{ data.like_num }}</span>
      </span>
      <img src="@img/btn/comment.png" @click="sendComment">
    </footer>
    <slot class="childComment"></slot>
  </div>
</template>

<script>
export default {
  props: ['data', 'illId'],

  data (){
    return {
      
    }
  },

  methods: {
    dian_Zan (){
      _request({
        url: 'openquiz/like',
        method: 'post',
        data: {
          quiz_id: this.data.quiz_id,
          answer_id: this.data.id,
          ill_id: this.illId,
          // 注意，这里的操作都是反的，也就是（未点赞 => 点赞 or 点赞 => 未点赞）
          type: this.data.like_status ? 0 : 1
        }
      }).then(({data}) =>{
        if(data.result){
          this.$bus.$emit('vux.toast', this.data.like_status ? '取消点赞' : '点赞成功')
          this.$emit('update')
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

    sendComment (){
      this.$toView('all_qa/qa_info/answer_info/commentEditor', {
        params: {
          quizId: this.data.quiz_id,
          illId: this.illId,
          name: this.data.role_name,
          fatherId: this.data.id
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.comment-box{
  padding: 10px 0 0 10px;
  border-top: 1px #ccc solid;
  margin-top: 10px;

  .icon{
    width: 40px;
    height: 40px;
    background-color: #ccc;
    border-radius: 50%;
    float: left;
    margin-right: 10px;
  }

  footer{
    text-align: right;
    margin-right: 10px;

    img{
      width: 1.5em;
      margin: 0 5px;
      vertical-align: middle;
    }
  }

  .childComment{
    margin-left: 5px;
  }
}


</style>
