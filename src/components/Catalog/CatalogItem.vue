<template>
  <div class="catalogBox">
    <div class="title-line" :class="{ titleLineUncollpase }" @click="onClick($event, catalog)">
      <div class="com-jiao" :class="{ collapsed }" 
        v-if="hasChild"
        @click="collapsed = !collapsed"
      ></div>
      <span>{{ catalog.catalog_name }}</span>
      <x-icon type="ios-arrow-down" size="16" v-if="hasChild" class="com-xicon-gray icon"></x-icon>
      <x-icon type="ios-arrow-right" size="16" v-if="!hasChild" class="com-xicon-gray icon"></x-icon>
      <span class="count">{{ catalog.article_number }}</span>
    </div>
    <slot v-if="!collapsed"></slot>
  </div>
</template>

<script>
export default {
  name: 'catalogItem',

  props: ['catalog', 'hasChild', 'onClickTitle'],

  data (){
    return {
      collapsed: true
    }
  },

  computed: {
    titleLineUncollpase (){
      return !this.collapsed
    }
  },

  methods: {
    onClick (e, catalog){
      if(!e.target.classList.contains('com-jiao')){
        this.onClickTitle(catalog)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.com-jiao{
  position: absolute;
  top: 50%;
  right: ~'calc(100% + 3px)';
  margin-top: -4px;
}

.catalogBox{
  width: 100%;
  box-sizing: border-box;
  padding: 2.5px 10px 2.5px;
  color: #666;
}

.title-line{
  position: relative;
}

.collapsed{
  transform: rotate(-90deg);
}

.titleLineUncollpase{
  background-color: #F5F7FA;
}

.icon{
  float: right;
  position: relative;
  top: 2px;
}

.count{
  float: right;
  margin-right: 5px;
}
</style>
