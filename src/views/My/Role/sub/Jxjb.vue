<template>
  <div class="com-container">
    <vue-header title="选择教学疾病"></vue-header>
    <p class="title">已选择疾病（点击删除）</p>
    <div class="options">
      <div class="item selected" v-for="(item, index) in selected" :key="index"
           @click="remove(item)"
      >{{ item.name }}
      </div>
    </div>
    <p class="title">内科疾病（点击添加）</p>
    <div class="options">
      <div class="item" v-for="(item, index) in options" :key="index"
           @click="add(item)"
      >{{ item.name }}
      </div>
    </div>
    <div class="com-mainBtn-container">
      <x-button text="确定" @click.native="done"></x-button>
    </div>
  </div>
</template>

<script>
    import {XButton} from 'vux'

    export default {
        components: {
            XButton
        },

        data() {
            return {
                options: [],
                selected: []
            }
        },

        mounted() {
            // 复制对象防止影响route.from组件
            var {options, selected} = JSON.parse(JSON.stringify(this.$route.params))

            selected = selected.map(val => parseInt(val))
            options.forEach(option => {
                if (selected.includes(option.id)) {
                    this.selected.push(option)
                } else {
                    this.options.push(option)
                }
            })
        },

        methods: {
            // 添加至选中
            add(item) {
                this.selected.push(item)
                this.options.some((val, ind) => {
                    if (item.id === val.id) {
                        this.options.splice(ind, 1);
                        return true
                    }
                })
            },

            // 从选中移除
            remove(item) {
                this.options.push(item)
                this.selected.some((val, ind) => {
                    if (item.id === val.id) {
                        this.selected.splice(ind, 1);
                        return true
                    }
                })
            },

            // 返回route.from，并携带已选项集
            done() {
                this.$bus.$emit('vux.toast', {
                    type: 'success',
                    text: '选择成功'
                })
                this.$toView(this.$route.params.back, {params: {selected: this.selected.map(val => val.id)}})
            }
        }
    }
</script>

<style lang="less" scoped>
  .title {
    font-size: 16px;
    margin: 10px 0;
    text-indent: 20px;
  }

  .options {
    min-height: 43px;
    background-color: white;
    padding: 5px 10px;
  }

  .item {
    display: inline-block;
    padding: 5px 15px;
    border: 1px #ccc solid;
    border-radius: 20px;
    margin: 5px;
  }

  .selected {
    background-color: @theme;
    color: white;
  }
</style>
