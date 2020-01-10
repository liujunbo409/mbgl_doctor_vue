<template>
    <div class="learningplanedit">
        <vue-header title="学习计划编辑"></vue-header>
        <div class="plan-title">{{plan_name}}</div>
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
      <!-- 这个DIV仅仅为了跳转到文章详情页 -->
        <div style="background:red;width:30px;height:30px" @click="toArticle">
        </div>
    
        <div style="background:yellow;width:30px;height:30px" @click="toEditCatalog">

        </div>

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
    mounted(){
        //获得路由传来的参数
        this.plan_id = this.$route.params.plan_id
        this.plan_name = this.$route.params.plan_name
        this.getPlanDetail();
    },
    methods:{
    //    增加课程
        addCourse(catalogid){
           
        //      _request({
        //         url:'doctorXxjhCourse/createCourse',
        //         method:'post',
        //         params:{
        //         //    doctor_id:this.$store.state.user.userInfo.id,
        //         //     id:this.plan_id
        //         }
        //     }).then(ret =>{

        //  })
        },

    // 下移目录
     moveDown(catalogid){
         
           _request({
                url:'doctorXxjhMulu/moveMulu',
                method:'post',
                params:{
                   doctor_id:this.$store.state.user.userInfo.id,
                    id:this.catalogid,
                    oper:'down',
                }
            }).then(ret =>{
                 this.$bus.$emit('vux.toast', '下移成功');
                    this.getPlanDetail();
         })

     },
      // 上移目录
     moveUp(catalogid){
         
           _request({
                url:'doctorXxjhMulu/moveMulu',
                method:'post',
                params:{
                   doctor_id:this.$store.state.user.userInfo.id,
                    id:this.catalogid,
                    oper:'up',
                }
            }).then(ret =>{
                 this.$bus.$emit('vux.toast', '上移成功');
                    this.getPlanDetail();
         })

     },
      // 删除目录
        removeCourse(catalogid){
           _request({
                url:'doctorXxjhMulu/deleteById',
                method:'post',
                params:{
                   doctor_id:this.$store.state.user.userInfo.id,
                    id:this.catalogid,
                }
            }).then(ret =>{   
                 this.$bus.$emit('vux.toast', '删除成功');
                  this.getPlanDetail();   
         })
     },
    // 渲染列表
        getPlanDetail(){
          console.log(`this.$store.state.user.userInfo.id == ${this.$store.state.user.userInfo.id} +++ this.plan_id = ${this.plan_id}`);
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

            console.log(`this.catalogList == ${JSON.stringify(this.catalogList)}`)
            console.log(this.catalogList)
            // console.log(`ret == ${JSON.stringify(this.catalogList)}`)

         })
        },
          toArticle(){
            this.$toView('learningArticle')
        },
         toEditCatalog(){
            this.$toView('learningplanEditCatalog')
        },
        //  //删除选中
        //     remove(item) {

        //         this.titlelist.some((val, index) => {
        //             if (item.id === val.id) {
        //                 this.titlelist.splice(index, 1);
        //                 return true
        //             }
        //         })
        //     },
        // //删除选中
        //   courseremove(item) {

        //         this.courselist.some((val, index) => {
        //             if (item.id === val.id) {
        //                 this.courselist.splice(index, 1);
        //                 return true
        //             }
        //         })
        //     },
        //  moveUp(item,index) {
        //     if(index == 0) {
        //     this.$bus.$emit('vux.toast', '到顶了')
        //     }else{
        //     //在上一项插入该项
        //     this.titlelist.splice(index-1,0,(this.titlelist[index]));
        //     //删除后一项
        //     this.titlelist.splice(index+1,1);
        //     }
        //     },
        // moveDown(index,item) {
        // //在下一项插入该项
        // this.titlelist.splice(index+2,0,(this.titlelist[index]));
        // // 删除前一项
        // this.titlelist.splice(index,1);

        // if(index == this.titlelist.length-1) {
        //     alert("已经是最后一项啦！");
        // }
        // },



    }
}
</script>
<style lang="less" scoped>
.learningplanedit{
    background: white;
}
.plan-title{
    line-height: 40px;
    padding-left: 10px;
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
