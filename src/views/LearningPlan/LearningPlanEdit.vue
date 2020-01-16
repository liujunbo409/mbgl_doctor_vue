<template>
    <div class="learningplanedit">
        <vue-header title="学习计划编辑"></vue-header>
        <div class="plan-title">{{plan_name}}</div>
        <div style="display:flex;justify-content:space-around;">
            <span style="margin-left:5px;display:inline-block;font-size:10px;" @click="addCatalog()"><span class="iconfont icon-zengjia" style="display:block;text-align:center"></span>增加目录</span>
            <p style="line-height:45px;font-size:15px">操作</p>
        </div>
         <vux-group class="com-group-noMarginTop">
        <dir-item v-for="(item, index) in catalogList" :key="index"
                  :title="item.catalog_name"
                  :courses="item.courses"
                  :catalogid="item.id"
                  @addCourse="catalogid=>addCourse(catalogid)"
                  @editCourse="catalogid=>editCourse(catalogid)"
                  @moveDown="catalogid=>moveDown(catalogid)"
                  @moveUp="catalogid=>moveUp(catalogid)"
                  @removeCourse="catalogid=>removeCourse(catalogid)"
         >        
        </dir-item>
        
      </vux-group>

        <!-- <div style="background:red;width:30px;height:30px" @click="toArticle">
        </div>
    
        <div style="background:yellow;width:30px;height:30px" @click="toEditCatalog">

        </div> -->

    </div>
</template>

<script>
import { Cell, CellBox, CellFormPreview, Group, Badge } from 'vux'
import DirItem from '@c/cell/DirItem'
export default {
    components: {
    Group,
    Cell,
    CellFormPreview,
    CellBox,
    Badge,
    DirItem
  },
    data(){
        return{
            plan_id:'',//学习计划id
            plan_name:'',//学习计划名称
            catalogList:[], //目录列表
            catalogid:'', //目录id
        }
    },
    beforeRouteLeave(to, from, next) {
         if(to.name === 'learningplanCatalog'){      
         }
         next()
    },
    mounted(){
        console.log(`mounted`)
        //获得路由传来的参数
        this.plan_id = this.$route.params.plan_id
        this.plan_name = this.$route.params.plan_name
        this.getPlanDetail();
    },
    methods:{
    //    增加目录
       addCatalog(){
           _request({
                url:'doctorXxjhMulu/edit',
                method:'post',
                params:{
                   doctor_id:this.$store.state.user.userInfo.id,
                    doctor_xxjh_id:this.plan_id,
                    catalog_name:'目录标题'   
                }
            }).then(ret =>{
                 this.$bus.$emit('vux.toast', '添加成功');
                    this.getPlanDetail();
         })
     },
    //    增加课程
        addCourse(catalogid){
             _request({
                url:'doctorXxjhCourse/createCourse',
                method:'post',
                params:{
                   doctor_id:this.$store.state.user.userInfo.id,
                   doctor_xxjh_mulu_id :this.catalog_id,
                   article_ids:'',
                   title:'',
                   author:'',
                }
            }).then(ret =>{
                console.log(ret)
         })
        },

    // 下移目录
     moveDown(catalogid){
           _request({
                url:'doctorXxjhMulu/moveMulu',
                method:'post',
                params:{
                   doctor_id:this.$store.state.user.userInfo.id,
                    id:catalogid,
                    oper:'up',
                }
            }).then(ret =>{
                 this.$bus.$emit('vux.toast', '下移成功');
                    this.getPlanDetail();
                    console.log(ret)  
         })

     },
      // 上移目录
     moveUp(catalogid){
           _request({
                url:'doctorXxjhMulu/moveMulu',
                method:'post',
                params:{
                   doctor_id:this.$store.state.user.userInfo.id,
                    id:catalogid,
                    oper:'down',
                }
            }).then(ret =>{
                 this.$bus.$emit('vux.toast', '上移成功');
                    this.getPlanDetail();
                    console.log(ret)  
         })
     },
      // 删除目录
        removeCourse(catalogid){
            console.log('目录id'+catalogid)
           _request({
                url:'doctorXxjhMulu/deleteById',
                method:'post',
                params:{
                   doctor_id:this.$store.state.user.userInfo.id,
                    id:catalogid,
                }
            }).then(ret =>{   
                 this.$bus.$emit('vux.toast', '删除成功');
                  this.getPlanDetail();
                  console.log(ret)   
         })
     },
    // 初始化数据
        getPlanDetail(){
              _request({
                url:'doctorXxjh/getById',
                method:'get',
                params:{
                   doctor_id:this.$store.state.user.userInfo.id,
                id:this.plan_id
                }
            }).then(ret =>{
            this.catalogList = ret.data.ret.mulus
            this.catalogid = ret.data.ret.mulus.id
         })
        },
          toArticle(){
            this.$toView('learningArticle')
        },
         toEditCatalog(){
            this.$toView('learningplanEditCatalog')
        },
        
    },
}
</script>
<style lang="less" scoped>
.learningplanedit{
    background: white;
}
.plan-title{
    line-height: 40px;
    padding-left: 10px;
    font-size: 20px;
    border-bottom: 1px solid #ccc
}
ul{
    list-style: none;
    border: 1px solid #ccc;

    >li{
        height:50px;

        padding: 0 20px;
        border-bottom: 1px solid #ccc;
    }
}
</style>
