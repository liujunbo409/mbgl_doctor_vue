<template>
  <div class="fillHeight">
    <vue-header title="审核文章"></vue-header>
    <vux-tab>
      <tab-item>待审核</tab-item>
      <tab-item>已审核</tab-item>
    </vux-tab>
  </div>
</template>

<script>
import { Tab, TabItem } from 'vux'

export default {
  components: {
    VuxTab: Tab, TabItem
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
