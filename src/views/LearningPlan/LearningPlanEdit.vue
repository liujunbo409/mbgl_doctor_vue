<template>
    <div class="learningplanedit">
        <vue-header title="学习计划编辑"></vue-header>
        <div class="plan-title">{{plan_name}}</div>
         <vux-group class="com-group-noMarginTop">
        <dir-item v-for="(item, index) in catalogList" :key="index"
                  :title="item.catalog_name"
        ></dir-item>
                  <!-- :files="allArticle[item.id]" -->
                  <!-- @click.native="loadArticleByStageId(item.id)"
                  @onClickItem="file => toArticle(item, file)" -->
      </vux-group>
       
        <!-- <ul>
            <li><span @click="toEditCatalog()"><span class="iconfont icon-zengjia" style="display:block;margin-left:20px;"></span>增加目录</span><span style="float:right;line-height:0px;margin-right:50px">操作</span></li>
            <li  v-for="(item,index) in titlelist" :key="index">
                <span style="line-height:50px;">{{item.title}}</span>
            <span style="float:right;margin-left:5px" @click="remove(item)"><span class="iconfont icon-shanchu-tianchong" style="display:block;margin-left:8px;"></span>删除</span>
            <span style="float:right;margin-left:5px" @click="moveUp(item,index)"><span class="iconfont icon-jiantoushang" style="display:block;margin-left:8px;"></span>上移</span>
            <span style="float:right;margin-left:5px" @click="moveDown(item,index)"><span class="iconfont icon-jiantouxia" style="display:block;margin-left:8px;"></span>下移</span>
            <span style="float:right;margin-left:5px" ><span class="iconfont icon-bianji" style="display:block;margin-left:8px;"></span>编辑</span>
            <span style="float:right;margin-left:5px" @click="toRecord()"><span class="iconfont icon-zengjia" style="display:block;margin-left:20px;"></span>增加课程</span>
            </li>
        </ul>
        <div style="height:50px;padding:0 20px"  v-for="(item,id) in courselist" :key="id">
            <span style="line-height:50px">{{item.title}}</span>
            <span style="float:right;margin-left:5px" @click="courseremove(item)"><span class="iconfont icon-shanchu-tianchong" style="display:block;margin-left:8px;"></span>删除</span>
            <span style="float:right;margin-left:5px" ><span class="iconfont icon-jiantoushang" style="display:block;margin-left:8px;"></span>上移</span>
            <span style="float:right;margin-left:5px" ><span class="iconfont icon-jiantouxia" style="display:block;margin-left:8px;"></span>下移</span>
            <span style="float:right;margin-left:5px" ><span class="iconfont icon-bianji" style="display:block;margin-left:8px;"></span>编辑</span>
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
            plan_id:'',
            plan_name:'',
            catalogList:[],
            titlelist:[
                {
                    id:"1",
                    title:"目录标题1",
                },
                {
                    id:"2",
                    title:"目录标题2",
                },
                {
                    id:"3",
                    title:"目录标题3",
                },

            ],
            courselist:[
                {
                    id:"1",
                    title:"课程标题1",
                },
                {
                    id:"2",
                    title:"课程标题2",
                },
                {
                    id:"3",
                    title:"课程标题3",
                },
                {
                    id:"4",
                    title:"课程标题4",
                },
                {
                    id:"5",
                    title:"课程标题5",
                },
            ],
        }
    },
    mounted(){
        //获得路由传来的参数
        this.plan_id = this.$route.params.plan_id
        this.plan_name = this.$route.params.plan_name
        this.getPlanDetail();
    },
    methods:{
        toEditCatalog(){
            this.$toView('learningplanEditCatalog')
        },
        toRecord(){
            this.$toView('learningplanRecord')
        },
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
            console.log(this.catalogList)
            // console.log(`ret == ${JSON.stringify(this.catalogList)}`)
            
         })
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