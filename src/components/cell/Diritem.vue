<template>
  <div>
    <vux-cell :title="title" :is-link="true"
      :arrow-direction="isCollapse ? 'down' : 'up'"
      @click.native="isCollapse = !isCollapse"
    ></vux-cell>
    <ul v-if="!isCollapse" class="list">
      <li v-for="(file, index) in files || []" :key="index" @click="$emit('onClickItem', file)">
        {{ file.article.title }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: [
    'title', 'files'
  ],

  data (){
    return {
      isCollapse: true
    }
  },

  methods: {

  }
}
</script>

<style lang="less" scoped>
.list{
  color: #666;
  padding-left: 45px;
  list-style: none;
  
  > li{
    line-height: 30px;
    padding-right: 5px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
}
</style>
