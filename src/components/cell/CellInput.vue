<!-- 和cell样式相同的输入框组件 -->
<template>
  <cell-box @click.native="$refs.input.focus" class="line">
    <span class="title">{{ title }}</span>
    <div class="com-input-container">
      <input :type="type" :value="value" class="input" :placeholder="placeholder" :disabled="disabled"
        ref="input"
        @input="$emit('input', $event.target.value)"
      >
    </div>
  </cell-box>
</template>

<script>
import { CellBox } from 'vux'
export default {
  props: {
    title: {
      default: ''
    },

    type: {
      default: 'text'
    },

    placeholder: {
      default: ''
    },
    
    value: {},
    disabled: {
      default: false
    }
  },

  components: {
    CellBox
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
.line{
  background-color: white;
  font-size: 17px;
  line-height: 1.4;
  border-bottom: 1px #ccc solid;
}

.com-input-container{
  display: inline-block;

  .input{
    margin-left: 20px;
    vertical-align: text-bottom;
  }
}
</style>
