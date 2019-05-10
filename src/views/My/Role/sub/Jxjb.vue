<template>
  <div class="com-container">
    <vue-header title="选择教学疾病"></vue-header>
    <p class="title">已选择疾病（点击删除）</p>
    <div class="options">
      <div class="item selected" v-for="(item, index) in selected" :key="index"
        @click="remove(item)"
      >{{ item.name }}</div>
    </div>
    <p class="title">内科疾病（点击添加）</p>
    <div class="options">
      <div class="item" v-for="(item, index) in options" :key="index"
        @click="add(item)"
      >{{ item.name }}</div>
    </div>
    <div class="com-mainBtn-container">
      <x-button text="确定" @click.native="done"></x-button>
    </div>
  </div>
</template>

<script>
import { XButton } from 'vux'
export default {
  components: {
    XButton
  },

  data (){
    return {
      options: [],
      selected: []
    }
  },

  mounted (){
    if(!this.$route.params.options){
      this.$toView('home')
    }else{
      var options = JSON.parse(JSON.stringify(this.$route.params.options))
      this.selected = JSON.parse(JSON.stringify(this.$route.params.selected))
      this.options = options.filter(option =>{
        return !this.selected.some(item => item.id === option.id)
      })
    }
  },

  methods: {
    add (item){
      this.selected.push(item)
      this.options.some((val, ind) =>{
        if(item.id === val.id){
          this.options.splice(ind, 1)
          return true
        }
      })
    },

    remove (item){
      this.options.push(item)
      this.selected.some((val, ind) =>{
        if(item.id === val.id){
          this.selected.splice(ind, 1)
          return true
        }        
      })      
    },

    done (){
      this.$toView(this.$route.params.back, { params: { selected: this.selected } })
    }
  }
}
</script>

<style lang="less" scoped>
.title{
  font-size: 16px;
  margin: 10px 0;
  text-indent: 20px;
}
.options{
  min-height: 43px;
  background-color: white;
  padding: 5px 10px;
}

.item{
  display: inline-block;
  padding: 5px 15px;
  border: 1px #ccc solid;
  border-radius: 20px;
  margin: 5px;
}
.selected{
  background-color: @theme;
  color: white;
}
</style>
