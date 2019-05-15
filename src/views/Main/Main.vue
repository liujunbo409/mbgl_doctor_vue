<template>
  <!--
    该组件负责管理显示路由和管理公共通知组件，以及需要在所有路由中显示的组件  
  -->
  <div class="com-container">
    <!-- 路由缓存 -->
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>

    <!-- actionsheet全局方法组件 -->
    <actionsheet v-model="visibleActionSheet"
      v-bind="actionSheet.options"
      @on-click-menu="actionSheet.onClick"
      @on-click-menu-cancel="actionSheet.onCancel"
      @on-click-mask="actionSheet.onMask"
    ></actionsheet>

    <!-- loading提示 -->
    <transition name="fade">
      <vux-spinner class="com-ab-center" v-show="visibleSpinner" :type="spinnerType"></vux-spinner>
    </transition>
  </div>
</template>

<script>
import { Toast, Actionsheet, Spinner } from 'vux'

import vueAlert from './vuxAlert.js'
export default {
  components: {
    VuxToast: Toast,
    Actionsheet,
    VuxSpinner: Spinner
  },

  data (){
    return {
      visibleActionSheet: false,
      actionSheet: {
        options: {},
        onClick: new Function(),
        onCancel: new Function(),
        onMask: new Function()
      },

      visibleSpinner: false,
      spinnerType: 'crescent'
    }
  },

  mounted (){
    // 注册的自定义vux通知方法（方法是自己封装的，非vux直接提供）
    vueAlert(this)
  },

  methods: {

  }
}
</script>

<style lang="less" scoped>

</style>
