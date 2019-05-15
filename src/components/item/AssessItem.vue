<template>
  <vux-cell :title="title" class="item">
    <span class="com-cell-text" :class="'status' + status" :style="{
      ...(color ? { color } : {})
    }">{{ ['未开启', '待审核', '审核通过', '审核驳回'][status || 1] }}</span>
    <span class="com-icon-link"></span>
  </vux-cell>
</template>

<script>
export default {
  props: ['title', 'status', 'color'],

  data (){
    return {

    }
  },

  methods: {

  }
}
</script>

<style lang="less" scoped>
.item{
  background-color: white;
}
.com-cell-text{
  font-size: 13px;
  

  &.status1{
    color: @theme;
  }
  &.status2{
    color: @success;
  }
  &.status3{
    color: @danger;
  }
}
</style>
