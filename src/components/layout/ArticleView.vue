<template>
  <div class="com-container">
    <vue-header :title="art ? art.title : '读取中...'"></vue-header>
    <main :class="{ hasFooter: $slots.default, visible: art && source }" :style="{ 
      ...(minusHeight ? { height: `calc(100% - ${minusHeight})` } : {})  
    }">
      <div class="main-container" v-if="art && source">
        <h2 class="title">{{ `${art.title}(${art.style_str})` }}</h2>
        <p class="author">{{ art.author }}&nbsp;{{ art.updated_at }}</p>
        <div class="content" v-html="art.html"></div>
        <p class="source-title com-fillTitle" v-if="source && source.length">参考文献</p>
        <div class="source" v-if="source">
          <p v-for="(item, index) in source" :key="index">
            <span class="count" v-text="`[${index + 1}]`"></span>&nbsp;
            <span class="text">{{ item.source_text }}</span>
          </p>
        </div>
        <table class="near" v-if="near">
          <tr>
            <td >
              <p>上一篇</p>
              <span v-if="lastStatus === 'success'">{{ last.title }}</span>
              <span v-if="lastStatus === 'loading'">加载中</span>
              <span v-if="lastStatus === 'error'">加载失败，点击重试</span>
            </td>
            <td >
              <p>下一篇</p> 
              <span v-if="nextStatus === 'success'">{{ next.title }}</span>
              <span v-if="nextStatus === 'loading'">加载中</span>
              <span v-if="nextStatus === 'error'">加载失败，点击重试</span>
            </td>
          </tr>
          <tr v-if="art.voice_url !== null">
            <td colspan="2">
              <div class="audio-container">
                <span class="audioText">音频</span>
                <audio-player :src="art.voice_url"></audio-player>
              </div>
            </td>
          </tr>
        </table>
      </div>
    </main>
    <slot></slot>
  </div>
</template>

<script>
import AudioPlayer from '@c/media/audioPlayer'

export default {
  components: {
    AudioPlayer
  },

  props: {
    art: {},
    source: {},
    minusHeight: {},
    near: {
      default: false
    },
    next: {},
    last: {},
    nextStatus: {},
    lastStatus: {}
  },

  data (){
    return {

    }
  },

  mounted (){
    
  },

  methods: {

  }
}
</script>

<style lang="less" scoped>
main{
  visibility: hidden;
  height: 100%;
  overflow: auto;

  .main-container{
    height: 100%;
    box-sizing: border-box;
    padding: 15px 10px;
  }

  .title{
    text-align: center;
    margin-bottom: 15px;
  }

  .author{
    text-align: center;
    font-size: 14px;
    color: #666;
  }

  .content{
    padding: 10px;
    font-size: 16px;
  }

  .source-title{
    font-size: 16px;
    line-height: 26px;
    border-radius: 10px;
  }

  .source{
    text-indent: 10px;
    padding: 5px;
  }
}

.visible{
  visibility: visible;
}

// 减去上栏(46px) + 下栏(默认50px)
.hasFooter{
  height: ~'calc(100% - 46px - 50px)';
}

.near{
  width: 100%;
  border-collapse: collapse;
  text-align: center;

  td{
    border: 1px #666 solid;
    padding: 5px;
    width: 50%;

    p{
      font-weight: bold;
    }
  }

  .audio-container{
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .audioText{
      font-size: 22px;
      font-weight: bold;
      position: relative;
      top: -2px;
      margin-left: 10px;
    }
  }
}
</style>
