<template>
  <div class="com-container">
    <inline-loading v-if="status === 2"></inline-loading>
    <view-box v-if="status === 3">
      <vue-header title="用户反馈" :back="modal ? () => $emit('input', false) : null"></vue-header>
      <vux-divider>反馈类型（多选）</vux-divider>    
      <vux-checker v-model="type" type="checkbox"
        class="checkers-container" 
        default-item-class="checkers"
        selected-item-class="selected"
      >
        <checker-item v-for="(val, ind) in types" :key="ind" :value="ind + 1">{{ val }}</checker-item>
      </vux-checker>
      <hr class="com-hrline">
      <x-textarea v-model.trim="content" :height="200" placeholder="请填写您的反馈内容，我们将尽快处理"
        class="textarea"></x-textarea>

      <div class="com-mainBtn-container">
        <x-button @click.native="submit">提交</x-button>
      </div>
    </view-box>
  </div>
</template>

<script>
import { Checker, CheckerItem, XButton, XTextarea, Divider } from 'vux'

export default {
  props: {
    feedbackType: {
      default: 'global',
    },
    moduleId: {
      default: 0
    },
    modal: {
      default: false
    }
  },

  components: {
    VuxChecker: Checker, CheckerItem, XButton, XTextarea, VuxDivider: Divider
  },

  data (){
    return {
      types: [],    // 所有type
      type: [],     // 已选type
      content: '',
      status: 1
    }
  },

  mounted (){
    this.status = 2
    _request({
      baseURL: Vue._GLOBAL.comApi,
      url: 'feedback',
      params: {
        type: this.feedbackType
      }
    })
    .then(({data}) =>{
      if(data.result){
        this.status = 3
        this.types = Object.values(data.ret)
      }
    }).catch(e =>{
      this.status = 0
      console.log(e)
      this.$bus.$emit('vux.toast', {
        type: 'cancel',
        text: '网络错误'
      })
    })
  },

  methods: {
    submit (){
      if(!this.type.length){
        this.$bus.$emit('vux.toast', '请选择反馈类型')
        return
      }
      if(this.content === ''){
        this.$bus.$emit('vux.toast', '反馈内容不能为空')
      }

      _request({
        baseURL: Vue._GLOBAL.comApi,
        url: 'feedbackPost',
        method: 'post',
        data: {
          mokuai: this.feedbackType,
          type: this.type.join('&'),
          role: this.$store.state.user.userInfo.role || 'user',
          mokuai_id: this.moduleId,
          content: this.content
        }
      })
      .then(({data}) =>{
        if(data.result){
          this.$bus.$emit('vux.toast', '提交成功，感谢您的反馈')
          this.$router.back()
        }
      })
      .catch(e =>{
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
  background-color: white;
}

.checkers-container{
  text-align: center;
}

.checkers{
  padding: 7px 14px;
  border: 1px #ccc solid;
  border-radius: 20px;
  margin: 10px;
  margin-top: 0;
}

.selected{
  background-color: @theme;
  border-color: @theme;
  color: white;
}

/deep/ .weui-cell::before{
  border-top: none;
}

.textarea{
  font-size: 15px;
}
</style>
