<!-- 主要用于用户信息输入，两种模式：input和btn -->
<template>
  <vux-cell :title="title" @click.native="$refs.input && $refs.input.focus()">
    <div class="com-input-container" v-if="type === 'input'">
      <input type="text" ref="input" :value="value" :placeholder="placeholder" 
      @input="$emit('input', $event.target.value.trim())">
    </div>
    <span class="value" v-if="type === 'btn'" :class="{ unset: isUndefined }">{{ isUndefined ? '未设置' : value }}</span>
  </vux-cell>
</template>

<script>
export default {
  props: {
    title: {},
    value: {},
    type: {
      default: 'input'
    },
    placeholder: {
      default: '未设置'
    }
  },

  data (){
    return {

    }
  },

  computed: {
    isUndefined (){
      return this.value === null || this.value === '' 
    }
  },

  methods: {

  }
}
</script>

<style lang="less" scoped>
.value{
  color: black;
}

.unset{
  color: #757575;
}

.com-input-container{
  color: black;
  font-size: 16px;
  text-align: right;
}
</style>
