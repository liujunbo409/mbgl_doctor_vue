<template>
  <div class="pageSelectorBar">
    <span class="btn" v-text="'<'" @click="$emit('onClickLeft')"></span>
    <span class="nowPage">{{ nowPage }}</span> 
    <span class="btn" v-text="'>'" @click="$emit('onClickRight')"></span>
    <span class="pageCount">共 {{ pageCount }} 页</span>
  </div>
</template>

<script>
export default {
  props:[
    'nowPage', 'pageCount'
  ],

  data (){
    return {

    }
  },

  methods: {

  }
}
</script>

<style lang="less" scoped>
.pageSelectorBar{
  text-align: center;
  color: #666;
  font-size: 15px;
  margin-top: 5px;
  background-color: white;

  .btn{
    margin: 0 20px;
    font-size: #aaa;
    font-weight: 500;
  }
  
  .nowPage{
    color: @theme;
    font-weight: 500;
  }
}
</style>
