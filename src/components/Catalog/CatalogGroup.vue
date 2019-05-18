<template>
  <div class="menuGroup">
    <!--
      注意这里的写法，循环的是一个组件，递归写在组件的插槽里。
      循环组件确保每个目录组拥有独立的状态，插槽起到递归时嵌套内容的作用。
     -->
    <catalog-item v-for="(catalog, index) in catalogs" :key="index" :catalog="catalog"
      :hasChild="catalog.childs.length" :onClickTitle="onClickTitle"
    >
      <catalog-group v-if="catalog.childs.length" :catalogs="catalog.childs" :onClickTitle="onClickTitle"></catalog-group>
    </catalog-item>
  </div>
</template>

<script>
import CatalogItem from './CatalogItem'

export default {
  name: 'catalogGroup',
  components: {
    CatalogItem
  },

  props: ['catalogs', 'onClickTitle'],

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
