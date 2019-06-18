<template>
  <div class="inline-loading">
    <vux-inline-loading></vux-inline-loading>
    <span class="loading-text">
      <slot>加载中</slot>
    </span>
  </div>
</template>

<script>
import { InlineLoading } from 'vux'
export default {
  components: {
    VuxInlineLoading: InlineLoading
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
.inline-loading{
  text-align: center;
  padding: 20px 0;
}

.loading-text{
  display: inline-block;
  vertical-align: middle;
  font-size: 14px;
}
</style>
