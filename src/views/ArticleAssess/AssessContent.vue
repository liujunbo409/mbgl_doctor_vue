<template>
  <article-view v-bind="{ art, source }">
    <div class="com-ab-center com-reloadBtn" v-if="status === 'error'" @click="load">重新加载</div>
    <footer>
      <div class="btn" @click="assess">审核通过</div>
      <div class="btn" @click="assess(false)">审核驳回</div>
    </footer>
  </article-view>

</template>

<script>
import ArticleView from '@c/layout/ArticleView'

export default {
  components: {
    ArticleView
  },
  
  data (){
    return {
      id: '',
      shenHe_Id: '',
      art: null,
      source: null,
      status: 'init',
      rejectTextCache: ''
    }
  },

  activated (){
    console.log('')
    this.id = this.$route.params.id
    this.shenHe_Id = this.$route.params.shenHe_Id
    this.load()
  },  

  methods: {
    // 载入文章
    load (){
      this.art = null
      this.source = null
      this.status = 'loading'
      this.$bus.$emit('vux.spinner.show')
      Promise.all([
        _request({
          url: 'article/shenhe/article',
          params: { article_id: this.id }
        }),
        
        _request({
          url: 'article/source',
          params: { article_id: this.id }
        }),
      ])
      .then(([{data: art}, {data: source}]) =>{
        this.$bus.$emit('vux.spinner.hide')
        if(art.result && source.result){
          this.status = 'success'
          this.art = art.ret
          this.source = source.ret
        }else{
          this.status = 'error'
          this.$bus.$emit('vux.toast', art.message)
        }
      }).catch(e =>{
        this.status = 'error'
        this.$bus.$emit('vux.spinner.hide')
        console.log(e)
        this.$bus.$emit('vux.toast', {
          type: 'cancel',
          text: '网络错误'
        })
      })
    },

    // 决定审核结果
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
          if(!isDone && val === ''){
            this.$bus.$emit('vux.toast', '驳回时必须填写理由')
            return
          }
          if(val.length > 100){
            this.$bus.$emit('vux.toast', '理由不能超过100字')
            return
          }

          _request({
            url: 'article/shenhe/shenhe',
            method: 'post',
            data: {
              shenhe_id: this.shenHe_Id,
              article_id: this.id,
              status: isDone ? 2 : 3,
              remark: val
            }
          }).then(({data}) =>{
            if(data.result){
              this.$bus.$emit('vux.toast', {
                type: 'success',
                text: '操作成功'
              })
              this.$toView('article_assess')
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
footer{
  height: 50px;
  width: 100%;
  display: flex;

  .btn{
    width: 50%;
    height: 100%;
    background-color: @theme;
    color: white;
    line-height: 50px;
    text-align: center;
    font-size: 14px;
    box-sizing: border-box;
    border-right: 1px #eee solid;

    &:last-child{
      border-left: 1px #eee solid;
    }
  }
}
</style>
