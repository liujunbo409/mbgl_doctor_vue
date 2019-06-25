<template>
  <div class="com-container">
    <vue-header title="审核详情"></vue-header>
      <view-box minus="40px" class="classify">
        <p class="top_text">{{ data.qa.question }}</p>
        <p class="top_time">
          <span>{{ data.qa.oper_name }}</span>
          <span>{{ data.qa.updated_at }}</span>  
          <!-- <span>浏览数:{{ data.count.doctor_show_num + data.count.user_show_num }}</span> -->
        </p>
        <p v-html="data.qa.answer" class="content"></p>
      </view-box>
      <div class="bottom-btn">
        <div class="l-btn" @click="assess">审核通过</div>
        <div class="r-btn" @click="assess(false)">审核驳回</div>
      </div>
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
      data:{},  // 在Reciew页传过来的数据
      shenHe_Id: '', // 	审核记录id
      status: 1,  // 切换状态
      rejectTextCache: ''
    }
  },
 created() {
   // 传过来的数据
    this.data = this.$route.params.data
    // console.log(this.$route.params.data)
  },
  methods: {
    // 弹出对话框
    assess (isDone = true){
      this.$vux.confirm.show({
        showInput: true,
        hideOnBlur: true,
        title: isDone ? '审核通过' : '审核驳回',
        content: '请填写理由',

        onShow: () =>{
          this.$vux.confirm.setInputValue(this.rejectTextCache)
        },

        onConfirm: val =>{
          if(!isDone && !val){
            this.$bus.$emit('vux.toast', '驳回时必须填写理由')
            return
          }
          if(val.length > 100){
            this.$bus.$emit('vux.toast', '理由不能超过100字')
            return
          }

          _request({
            url: 'qa/shenhe/shenhe',
            method: 'post',
            data: {
              shenhe_id: this.data.id,
              status: isDone ? 2 : 3,
              remark: val
            }
          }).then(({data}) =>{
            if(data.result){
              this.$bus.$emit('vux.toast', {
                type: 'success',
                text: '操作成功'
              })
              this.$toView('review_qa')
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
        onCancel: () =>{
          // vux没提供获取输入框值的手段，只能通过dom获取
          var val = document.querySelector('.vux-prompt-msgbox').value
          this.rejectTextCache = val;
        }
      })
    },
  }
}
</script>

<style lang="less" scoped>
  .top_text {
    margin: 8px auto;
    text-align: center;
    font-weight: 700;
    font-size: 15px;
  }
  .top_time {
    text-align: center;
    color: #aaa;
    font-size: 12px;
  }
  .content {
    padding-left: 5px;
    margin: 10px 0;
  }
  .btn {
    width: 140px;
    height: 25px;
    line-height: 25px;
    background-color: white;
    text-align: center;
    border-radius: 51px;
    margin-top: 8px;
    border: 1px #aaa solid;
  }
  .bottom-btn {
    height: 40px;
    line-height: 40px;
    color: white;
    background-color: @theme;
    text-align: center;
  }
  .classify /deep/ #vux_view_box_body {
    padding: 10px !important;
    box-sizing: border-box;
  }
  .bottom-btn{
    height: 40px;
    
  }
  .l-btn{
    width: 50%;
    background:  @theme;
    float: left;
    border-right: 0.25px solid #ffffff;
    box-sizing: border-box;
  }
  .r-btn{
    width: 50%;
    background: @theme;
    float: right;
    border-left: 0.25px solid #ffffff;
    box-sizing: border-box;
  }
</style>
