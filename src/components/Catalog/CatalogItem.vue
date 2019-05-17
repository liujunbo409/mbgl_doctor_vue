<template>
  <div class="catalogBox">
    <div>
      <div class="com-jiao" :class="{ collapsed }"
        v-if="hasChild"
        @click="collapsed = !collapsed"
      ></div>
      <span>{{ catalog.catalog_name }}</span>
    </div>
    <slot v-if="!collapsed"></slot>
  </div>
</template>

<script>
export default {
  name: 'catalogItem',

  props: ['catalog', 'hasChild'],

  data (){
    return {
      collapsed: true
    }
  },

  methods: {
    uncollapse (){

    }
  }
}
</script>

<style lang="less" scoped>
.com-jiao{
  margin: 0 7px;
}

.catalogBox{
  margin-left: 15px;
  color: #666;
}

.collapsed{
  transform: rotate(-90deg);
}
</style>
