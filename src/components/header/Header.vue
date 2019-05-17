<!-- 公用头部导航 -->
<template>
  <x-header :title="title" :left-options="{
      backText: '',
      preventGoBack: back !== null
    }" @on-click-back="back || new Function()" class="header">
    <img slot="right" src="@img/btn/home.png" style="position:relative; top:-3px;" 
      @click="$toView('home')" width="25px"
      v-if="visibleHomeBtn"
    >
    <!-- 该插槽重写left内容，间接消除back按钮 -->
    <span slot="overwrite-left" v-if="!visibleBackBtn"></span>
  </x-header>
</template>

<script>
import { XHeader } from 'vux'

export default {
  components: {
    XHeader
  },

  props: {
    title: {},

    visibleBackBtn: {
      default: true
    },
    
    visibleHomeBtn: {
      default: true
    },

    back: {
      default: null
    }
  },

  data (){
    return {

    }
  },

  methods: {

  }
}
</script>

<style lang="less" scoped>
.header{
  z-index: 100;
}
</style>
