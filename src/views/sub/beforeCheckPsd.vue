<!-- 该页面在需要进行前一步验证密码的操作时使用 -->
<template>
  <before-check-psd :title="$route.params.title" :next="$route.params.next"></before-check-psd>
</template>

<script>
import BeforeCheckPsd from '@c/BeforeCheckPsd'

export default {
  components: {
    BeforeCheckPsd
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

</style>
