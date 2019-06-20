<template>
  <div class="comments">
    <comment-item v-for="(item, index) in data" :key="index" :data="item" :illId="illId" @update="$emit('update')">
      <comments v-if="item.childs.length" :data="item.childs" :illId="illId"></comments>
    </comment-item>
  </div>
</template>

<script>
import CommentItem from './CommentItem'

export default {
  name: 'Comments',
  components: {
    CommentItem
  },

  props: ['data', 'illId'],

  data (){
    return {
      statusGroup: {}
    }
  },

  methods: {
    uncollapse (){

    }
  }
}
</script>

<style lang="less" scoped>

</style>
