<template>
  <div class="com-container">
    <vue-header title="问答题库"></vue-header>
    <inline-loading v-if="!infoData"></inline-loading>
    <template v-else>
      <view-box minus="40px" class="classify">
        <p class="top_text">{{ infoData.question.question }}</p>
        <p class="top_time">
          <span>{{ infoData.question.oper_name }}</span>
          <span>{{ infoData.question.updated_at }}</span>  
          <span>浏览数:{{ infoData.count.doctor_show_num + infoData.count.user_show_num }}</span>
        </p>

        <p>所属分类: {{ infoData.banks.map(val => val.bankname).join(' > ') }}</p>
        <p v-html="infoData.question.answer" class="content"></p>

        <div class="binds" v-if="infoData.binds.length">
          <p class="title com-fillTitle">关联文章：</p>
          <p class="info-item" v-for="(item, index) in infoData.binds" :key="index"
            @click="toArticle(item)"
          >{{ `[${index + 1}] ${item.article.title}` }}</p>
        </div>

        <div class="sources" v-if="infoData.sources.length">
          <p class="title com-fillTitle">问答来源：</p>
          <p class="info-item" v-for="(item, index) in infoData.sources" :key="index"
          >{{ `[${index + 1}] ${item.journal_date} ${item.journal_name}` }}</p>
        </div>

        <div class="btn" @click="showFeedback">问答反馈</div>
      </view-box>
      <div
        class="bottom-btn"
        @click="toggleState"
        :class="{ disabled: status === 2 }"
      >{{ isCollected ? '取消' : '添加' }}收藏</div>
    </template>

    <vue-feedback feedbackType="question" :moduleId="bankId" :modal="true" class="com-modal"
      v-if="visibleFeedback"
      v-model="visibleFeedback"
    ></vue-feedback>
  </div>
</template>

<script>
import Feedback from '@c/layout/Feedback'
export default {
  components: {
    VueFeedback: Feedback
  },

  data() {
    return {
      questionId: this.$route.query.questionId,
      bankId: this.$route.query.bankId,
      infoData: null,
      isCollected: false,
      status: 1,
      clickCount: 0,
      visibleFeedback: false,
    }
  },

  mounted() {
    this.load()
    this.getCollectState()
  },
  
  methods: {
    // 读取问答主体
    load() {
      this.$bus.$emit('vux.spinner.show')
      _request({
        url: 'qa/info',
        params: {
          question_id: this.questionId,
          bank_id: this.bankId || 0
        }
      })
      .finally(() => this.$bus.$emit('vux.spinner.hide'))
      .then(({ data }) => {
        if (data.result) {
          this.infoData = data.ret
        } else {
          this.$bus.$emit('vux.toast', data.message)
        }
      })
      .catch(e => {
        console.log(e)
        this.$bus.$emit('vux.toast', {
          type: 'cancel',
          text: '网络错误'
        })
      })
    },

    // 获取收藏状态
    getCollectState() {
      _request({
        url: 'qa/collect',
        params: {
          qa_id: this.questionId
        }
      })
      .finally(() => this.$bus.$emit('vux.spinner.hide'))
      .then(({ data }) => {
        if (data.result) {
          this.isCollected = data.ret
        } else {
          this.$bus.$emit('vux.toast', data.message)
        }
      })
      .catch(e => {
        console.log(e)
        this.$bus.$emit('vux.toast', {
          type: 'cancel',
          text: '网络错误'
        })
      })
    },

    // 切换收藏状态
    toggleState() {
      if (this.clickCount > 4) {
        this.$bus.$emit('vux.toast', '您的点击频率过快')
        return
      }

      this.clickCount++
      setTimeout(() => this.clickCount--, 10000)

      this.status = 2
      this.$vux.loading.show()
      _request({
        url: 'qa/collectPost',
        method: 'post',
        data: {
          qa_id: this.questionId
        }
      })
      .finally(this.$vux.loading.hide)
      .then(({ data }) => {
        if (data.result) {
          this.status = 3
          this.isCollected = !this.isCollected
          this.$bus.$emit('vux.toast', {
            type: 'success',
            text: this.isCollected ? '已添加收藏' : '已取消收藏'
          })
        } else {
          this.status = 0
          this.$bus.$emit('vux.toast', data.message)
        }
      })
      .catch(e => {
        console.log(e)
        this.status = 0
        this.$bus.$emit('vux.toast', {
          type: 'cancel',
          text: '网络错误'
        })
      })
    },

    // 显示文章反馈
    showFeedback (){
      this.visibleFeedback = true
    },

    // 跳转至指定文章
    toArticle (data){
      var {article} = data
      article.ill_id = data.article_ill
      article.mulu_id = data.article_mulu
      this.$toView('article_all/article', {
        params: {
          data: article,
          type: data.article.type,
          listType: 'menu'
        }
      })
    }
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

.com-fillTitle{
  font-size: 16px;
  line-height: 26px;
  border-radius: 10px;
}

.info-item{
  margin: 5px 0 0 10px;
}
</style>
