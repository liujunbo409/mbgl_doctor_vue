<template>
  <div class="com-container">
    <vue-header title="公开问答"></vue-header>
    <p class="header-nav">
      <span>提问疾病: {{ ill.ill_name }}</span>
      <span class="switch_other" @click="$toView('open_qa/all_ill')">切换疾病</span>
      <span class="right-txt" @click="submit">提问</span>
    </p>

    <vux-group class="com-group-noMarginTop">
      <x-textarea v-model.trim="title" :max="100" placeholder="请简明写下您的问题，并以“?”结尾" :height="40" @on-change="onContentChange"></x-textarea>
    </vux-group>

    <div v-show="!visibleSimilarQA">
      <vux-group class="com-group-noMarginTop">
        <x-textarea v-model.trim="content" :max="500" ref="content"
          placeholder="填写问题的详细描述，表述清晰越容易得到答案(选填)"
          :show-counter="false"
          :height="100"
        ></x-textarea>
      </vux-group>
      <div class="bottom-box">
        <p class="bottom-text">可以先去问答题库找找您想问的问题</p>
        <p class="bottom-text">得不到满意答案再来提问呦</p>
        <span class="bottom-span">去问答题库看看</span>
      </div>
      <img src="@img/home/woman_doctor.png" class="bottom-img" alt="">
    </div>

    <template v-if="visibleSimilarQA">
      <p class="similarQ-text">相似提问</p>
      <view-box minus="181px" class="list-container">
        <vux-cell v-for="(item, index) in searchOpenQuestions.data" :key="index" class="similarQ-list"
          :title="item.title"
          :inline-desc="`浏览：${item.answer_num}  ${item.attention_num}人关注`"
          @click.native="$toView('open_qa/qa_info', { query: { qaId: item.id } })" 
        ></vux-cell>
        <transition name="fade">
          <vux-spinner type="crescent" class="loading" v-if="visibleSpinner"></vux-spinner>
        </transition>
      </view-box>

      <p class="similarQ-textInimg" @click="hideSimilarQA">
        <img class="similarQ-img" src="@img/btn/edit_black.png">
        <span>添加问题描述</span>
      </p>
    </template>
  </div>
</template>

<script>
import { XTextarea, Spinner } from 'vux'
import { setTimeout, clearTimeout } from 'timers'
export default {
  components: {
    XTextarea,
    VuxSpinner: Spinner
  },

  data() {
    return {
      ill: {},
      title: '',
      content: '',
      visibleSimilarQA: false,
      search_word: '',
      searchOpenQuestions: [],
      visibleSpinner: false,
      onChangeTimeoutKey: 0
    }
  },

  activated() {
    if(this.$route.params.ill) {
      this.ill = this.$route.params.ill
    }
  },
  methods: {
    onContentChange(val) {
      this.visibleSimilarQA = !!val
      this.visibleSpinner = true

      clearTimeout(this.onChangeTimeoutKey)
      this.onChangeTimeoutKey = setTimeout(() => {
        _request({
          url: 'openquiz/getListBySearch',
          params: {
            ill_id: this.ill.ill_id,
            title: this.title,
            content: this.content,
            page_size: 10
          }
        })
        .finally(() => (this.visibleSpinner = false))
        .then(({ data }) => {
          if (data.result) {
            this.searchOpenQuestions = data.ret
          } else {
            this.$bus.$emit('vux.toast', data.message)
          }
        })
      }, 1000)
    },

    hideSimilarQA (){
      this.visibleSimilarQA = false
      Vue.nextTick(() => this.$refs.content.$el.querySelector('textarea').focus())
    },

    submit() {
      if (!this.title) {
        this.$bus.$emit('vux.toast', '标题不能为空')
        return
      }
      if (!/[\?？]$/.test(this.title)) {
        this.$bus.$emit('vux.toast', '标题必须以问号结尾')
        return
      }
      _request({
        url: 'openquiz/addOpenQuiz',
        method: 'post',
        data: {
          ill_id: this.ill.ill_id,
          title: this.title,
          search_word: this.search_word
        }
      }).then(({ data }) => {
        if (data.result) {
          this.$toView('open_qa/question/questioned')
        } else {
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
.header-nav {
  height: 35px;
  border: 1px solid #e4e4e4;
  line-height: 35px;
  padding-left: 13px;
}
.switch_other {
  color: @theme;
}
.first-textarea {
  height: 50px;
}
.bottom-box {
  text-align: center;
}
.bottom-text {
  padding-top: 10px;
  font-size: 15px;
  font-weight: 500;

  @media screen and (max-width: 330px) {
    padding-top: 5px;
  }
}
.bottom-box {
  padding-top: 10px;
}
.bottom-span {
  color: @theme;
  display: grid;
  padding-top: 10px;
  font-size: 15px;
  font-weight: 500;
}
.bottom-img {
  width: 50%;
  display: table;
  margin: 13px auto 0;
}
.right-txt {
  float: right;
  padding-right: 9px;
}
.similarQ-text {
  line-height: 25px;
  height: 28px;
  border: 1px solid #e4e4e4;
  padding-left: 5px;
}
.similarQ-list {
  background-color: white;
}
.similarQ-textInimg {
  height: 28px;
  line-height: 28px;
  border: 1px solid #e4e4e4;
  padding-left: 5px;
}
.similarQ-img {
  height: 18px;
  line-height: 18px;
  vertical-align: text-top;
}

.list-container {
  position: relative;

  .loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
