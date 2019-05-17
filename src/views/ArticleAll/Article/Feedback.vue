<template>
  <vue-feedback feedbackType="article" :moduleId="$route.params.id"></vue-feedback>
</template>

<script>
import VueFeedback from '@c/layout/Feedback'

export default {
  components: {
    VueFeedback
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
