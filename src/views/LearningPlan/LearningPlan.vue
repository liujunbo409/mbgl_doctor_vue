<template>
    <div>
        <vue-header title="学习计划设置"></vue-header>
         <div class="com-input-container" >
      <input type="text" v-model="key_word" placeholder="输入关键字搜索疾病">
      <span class="searchBtn" @click="getList()">搜索</span>
    </div>
    <checklist ref="demoObject" label-position="left" :options="ill_list" v-model="ill_list_value" :max="1" @on-change="change"></checklist>
    <div class="com-mainBtn-container">
        <x-button text="确定" @click.native="toCatalog()"></x-button>
      </div>

    </div>
</template>
<script>
import {Checklist,XButton} from 'vux'
export default {
    components:{
        Checklist,
        XButton
    },   

  data () {
    return {
      ill_list: [],   //疾病数据
      ill_list_value: [''],
      key_word:'',//搜索关键字
      ill_id:'',  //疾病ID
      ill_name:'', //疾病名称
    }
  },
  mounted (){
      this.baseIllList();
  },
  methods:{
      //初始化数据
    baseIllList(){
     _request({
        baseURL: Vue._GLOBAL.comApi,
        url: 'baseIllList',
      }).then(({data: {ret}}) =>{
        this.ill_list=ret.map(val => ({key: val.id, value: val.name}));
        console.log(this.ill_list)
      })
    },
    //单选切换
    change (val, label) {
      this.ill_id=val[0];
      this.ill_name = label[0]
    },
    //搜索
    getList(){
      this.ill_list = this.key_word?this.ill_list.filter(item=>item.value.includes(this.key_word)):this.ill_list
    },
    //去疾病学习计划详情页
     toCatalog(){
       if(this.ill_id == ''){
        this.$bus.$emit('vux.toast', {type: 'cancel', text: '请选择疾病'});
       }else{
        // this.$toView('learningplanCatalog', {
        //  params: {
        //        ill_id: this.ill_id,
        //       ill_name:this.ill_name,
        //   }
        // });

        let query = {
          ill_id: this.ill_id,
          ill_name:this.ill_name,
        };
        this.$router.push({path: 'learningplanCatalog', query: query});
       }
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
