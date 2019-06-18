<template>
  <div class="com-container">
    <vue-header title="我收藏的问答题库"></vue-header>
    <div class="com-input-container">
      <input type="text" v-model.trim="keyword">
      <span class="searchBtn" @click="load(keyword)">搜索</span>
    </div>
    <view-box minus="59px" ref="list">
      <vux-group class="com-group-noMarginTop">
        <vux-cell v-for="(item, index) in collectionQaList.data" :key="index" :is-link="true" 
          :title="item.qa.question" :inline-desc="`收藏时间:${item.qa.updated_at}`" 
          @click.native="$toView('collection_qa/qa_info', { query: { questionId: item.qa.id } })"
        ></vux-cell>
      </vux-group>
    </view-box>

    <page-selector
      :nowPage="collectionQaList.current_page || '...'"
      :pageCount="Math.ceil(collectionQaList.total / 10)"
      @onClickLeft="jumpPage(-1)"
      @onClickRight="jumpPage(1)"
    ></page-selector>

    <router-view class="com-modal"></router-view>
  </div>
</template>

<script>
import PageSelector from '@c/block/PageSelector'

export default {
  components: {
    PageSelector
  },

  data() {
    return {
      qaId: '',
      keyword: '',
      collectionQaList: [],
    }
  },

  mounted() {
    this.load()
  },

  methods: {
    load(keyword, currentPage = 1) {
      if(this.collectionQaList && (currentPage > this.collectionQaList.last_page)){
        this.$bus.$emit('vux.toast', '已经是最后一页')
        return
      }
      if(currentPage < 1){
        this.$bus.$emit('vux.toast', '已经是第一页')
        return
      }

      this.$bus.$emit('vux.spinner.show')
      _request({
        url: 'qa/collectList',
        params: {
          questionSearch: keyword,
          page: currentPage,
        }
      }).finally(() => this.$bus.$emit('vux.spinner.hide'))
      .then(({ data }) => {
        if (data.result) {
          this.collectionQaList = data.ret.collections
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

    jumpPage (num){
      var page = this.collectionQaList.current_page + num
      this.load(this.keyword, page)
      Vue.nextTick(() => this.$refs.list.scrollTo(0))      
    },
  }
}

</script>

<style lang="less" scoped>
.com-input-container {
  background-color: white;
  width: 100%;
  display: flex;
  height: 30px;

  > input {
    padding: 5px;
    border-bottom: 2px #aaa solid;
  }

  > .searchBtn {
    display: inline-block;
    width: 70px;
    line-height: 30px;
    text-align: center;
    .themeBtn;
  }
}
</style>
