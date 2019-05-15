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
        <p class="source-title com-fillTitle">参考文献</p>
        <div class="source">
          <p v-for="(item, index) in source" :key="index">
            <span class="count" v-text="`[${index + 1}]`"></span>&nbsp;
            <span class="text">{{ item.source_text }}</span>
          </p>
        </div>
      </div>
    </main>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: ['art', 'source', 'minusHeight'],

  data (){
    return {

    }
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
    font-size: 16px;
    text-align: center;
    margin-bottom: 15px;
  }

  .author{
    font-size: small;
    color: #666;
  }

  .content{
    padding: 10px;
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
</style>
