<template>
    <div class="LeariningPlanEditCatalog">
        <vue-header title="学习计划A"></vue-header>
        <vux-tab :animate="false">
      <tab-item @click.native="edit_type = 0" ref="editcatalog">编辑目录</tab-item>
      <tab-item @click.native="edit_type = 1">编辑文章</tab-item>
    </vux-tab>
    <div v-if="edit_type === 0">
    <div class="com-mainBtn-container">
        <x-button text="增加一级目录"></x-button>
      </div>
      <ul>
            <li><span style="line-height:50px;margin-left:25px;">目录名</span><span style="float:right;line-height:50px;margin-right:50px">操作</span></li>
            <li  v-for="(item,index) in cataloglist" :key="index">
                <span style="line-height:50px;">{{item.title}}</span>
            <span style="float:right;margin-left:5px" ><span class="iconfont icon-shanchu-tianchong" style="display:block;margin-left:8px;"></span>删除</span>
            <span style="float:right;margin-left:5px" ><span class="iconfont icon-jiantoushang" style="display:block;margin-left:8px;"></span>上移</span>
            <span style="float:right;margin-left:5px" ><span class="iconfont icon-jiantouxia" style="display:block;margin-left:8px;"></span>下移</span>
            <span style="float:right;margin-left:5px" ><span class="iconfont icon-bianji" style="display:block;margin-left:8px;"></span>编辑</span>
            <span style="float:right;margin-left:5px" ><span class="iconfont icon-zengjia" style="display:block;margin-left:30px;"></span>新增子目录</span>
            </li>
        </ul>
    </div>
    <div v-if="edit_type === 1">
        <ul>
             <li><span style="line-height:50px;margin-left:25px;">目录名</span><span style="float:right;line-height:50px;margin-right:50px">操作</span></li>
        </ul>
      
    </div>
    </div>
</template>
<script>
import {Tab, TabItem,XButton} from 'vux'
 import DirItem from '@c/cell/DirItem'
export default {
    components:{
        VuxTab: Tab, TabItem,DirItem,
         XButton
    },
    data(){
        return{
            edit_type : 0,
              allStage: [],
                cataloglist:[
                {
                    title:"一级目录标题1",
                },
                {
                    title:"一级目录标题2",
                },
                {
                    title:"一级目录标题3",
                },

            ]
        }
    },
    mounted(){
        this.$refs.editcatalog.$el.click()
    },
    methods:{
        //  // 载入全部阶段
        //     loadAllStage() {
        //         _request({
        //             url: 'xxjh/illAllStage',
        //             params: {
        //                 ill_id: this.illId
        //             }
        //         }).then(({data}) => {
        //             this.allStage = data.ret;
        //         }).catch(e => {
        //             console.log(e)
        //             this.$bus.$emit('vux.toast', {
        //                 type: 'cancel',
        //                 text: '网络错误'
        //             })
        //         })
        //     },
        //    loadArticleByStageId(id) {
        //         if (id in this.allArticle) {
        //             return
        //         }
        //         _request({
        //             url: 'xxjh/stageArticle',
        //             params: {
        //                 stage: id
        //             }
        //         }).then(({data}) => {
        //             Vue.set(this.allArticle, id, data.ret)
        //             console.log(123)
        //         }).catch(e => {
        //             console.log(e)
        //             this.$bus.$emit('vux.toast', {
        //                 type: 'cancel',
        //                 text: '网络错误'
        //             })
        //         })
        //     },

        //     toArticle(stage, art) {
        //         this.$toView('course/course_article', {
        //             params: {
        //                 articleId: art.article.id,
        //                 illId: this.illId,
        //                 stageId: stage.id

        //             }
        //         })
        //         console.log(567)
        //     },
    }
}
</script>
<style lang="less" scoped>
.LeariningPlanEditCatalog{
    background: white;
}
.com-mainBtn-container{
    margin-top: 0px;
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