<template>
    <div>
        <vue-header title="学习计划设置"></vue-header>
         <div class="com-input-container" >
      <input type="text" v-model="keyword" placeholder="输入关键字搜索疾病">
      <span class="searchBtn" @click="getList(keyword)">搜索</span>
    </div>
    <checklist ref="demoObject" label-position="left" :options="objectList" v-model="objectListValue" :max="1" @on-change="change"></checklist>
    <div class="com-mainBtn-container">
        <x-button text="确定" @click.native="toCatalog()"></x-button>
      </div>

    </div>
</template>
<script>
import {Checklist,XButton} from 'vux'
let id ;
let name ;
export default {
    components:{
        Checklist,
        XButton
    },
    
  data () {
    return {
      objectList: [],
      objectListValue: [''],
      keyword:'',
    }
  },
  mounted (){
      this.baseIllList();
  },
  methods:{
    baseIllList(){
     _request({
        baseURL: Vue._GLOBAL.comApi,
        url: 'baseIllList',
      }).then(({data: {ret}}) =>{
        this.objectList=ret.map(val => ({key: val.id, value: val.name}));
        console.log(this.objectList)
      })

      
    },
    change (val, label) {
      id=val[0];
      name = label[0]

    },
    getList(keyword){
      this.objectList = this.keyword?this.objectList.filter(item=>item.value.includes(this.keyword)):this.objectList
    },
     toCatalog(){
        this.$toView('learningplanCatalog', {
         params: { 
               ill_id: id,
              ill_name:name,
          }
        })
     }
  }
}

</script>
<style lang="less" scoped>
.com-input-container {
  background-color: white;
  width: 100%;
  display: flex;
  height: 30px;

  > input {
    padding: 5px;
    border-bottom: 2px #aaa solid;
  }

  > .searchBtn {
    display: inline-block;
    width: 70px;
    line-height: 30px;
    text-align: center;
    .themeBtn;
  }
}

</style>