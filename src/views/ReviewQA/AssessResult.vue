<template>
  <div class="com-container">
    <vue-header title="问答详情"></vue-header>
    <view-box minus="250px">
      <p class="top_text">{{ data.qa.question }}</p>
        <p class="top_time">
          <span>{{ data.qa.oper_name }}</span>
          <span>{{ data.qa.updated_at }}</span>  
        </p>
        <p v-html="data.qa.answer" class="content"></p>
    </view-box>
    <footer>
      <div class="com-fillTitle">我的审核记录</div>
      <p class="status">
        <span :class="'status' + data.status">
          {{ ['　　　', '待审核', '已通过', '被驳回'][data.status] }}&emsp;
        </span>
        <span class="date">{{ data.updated_at }}</span>
      </p>
      <div class="remark">
        理由：{{ data.remark || '未填写' }}
      </div>
    </footer>
  </div>
</template>

<script>
import ArticleView from '@c/layout/ArticleView'
export default {
  components: {
    ArticleView
  },

  data (){
    return {
      data:[], // 传过来的数据
      status: 1, // 切换状态
      date: '',
    }
  },

 created(){
    this.data = this.$route.params.data
    // console.log(this.data)s
  },

  methods: {
 },
}
</script>

<style lang="less" scoped>
footer{
  height: 250px;
  background-color: white;
  font-size: 18px;

  * {
    vertical-align: middle; 
  }
  
  .com-fillTitle{
    line-height: 40px;
  }

  .status{
    padding: 10px;

    [class*="status"]{
      position: relative;
      top: -1px;
    }
    .status1{
      color: #c6c6c6;
    }
    .status2{
      color: @success;
    }
    .status3{
      color: @danger;
    }
  }

  .remark{
    padding: 0 10px;
    height: 160px;
    overflow: auto;
  }
}
    .top_text {
    margin: 8px auto;
    text-align: center;
    font-weight: 700;
    font-size: 25px;
  }
  .top_time {
    text-align: center;
    color: #aaa;
    font-size: 12px;
  }
   .content {
    padding-left: 15px;
    margin: 10px 0;
  }

</style>
