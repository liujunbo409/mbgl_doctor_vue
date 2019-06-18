<template>
  <vux-view-box :style="styleStr" class="header-view" body-padding-bottom="0" ref="body">
    <slot></slot>
  </vux-view-box>
</template>

<script>
import { ViewBox } from 'vux'
export default {
  components: {
    VuxViewBox: ViewBox
  },

  props: {
    minus: {
      default: '0px'
    }
  },

  data (){
    return {
      
    }
  },

  mounted (){

  },

  computed: {
    isRemoteMode (){
      return !!this.$store.state.user.userInfo2
    },

    styleStr (){
      return `height:calc(100% - 46px ${this.isRemoteMode ? '- 30px' : ''} - ${this.minus})`
    },
  },

  methods: {
    scrollTo (top){
      this.$refs.body.scrollTo(top)
    }
  }
}
</script>

<style lang="less" scoped>
.header-view{
  height: ~'calc(100% - 46px)';
}
</style>
