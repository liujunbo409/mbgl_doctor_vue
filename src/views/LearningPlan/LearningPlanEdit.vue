<template>
  <div class="learningplanedit">
    <vue-header title="学习计划编辑"></vue-header>
    <div style="display: flex;justify-content: space-between;width: 100%;border-bottom: 1px solid #ccc;" v-if="!plan_name_edit_static">
      <div class="plan-title" style="width: 85%;">{{plan_name}}</div>
      <div style="height: 40px;font-size: 20px;display: flex;align-items: center;justify-content: flex-end;padding-right: 10px;width: 15%;color: blue;"
           @click="plan_name_edit_static = !plan_name_edit_static">编辑
      </div>
    </div>
    <div style="display: flex;justify-content: space-between;border-bottom: 1px solid #ccc;" v-else>
      <input type="text" class="plan-title-input" v-model="plan_name"/>
      <div style="height: 40px;font-size: 20px;display: flex;align-items: center;padding-right: 10px;color: blue;">
        <div style="height: 100%;display: flex;align-items: center;padding-right: 10px;" @click="SavePlanName()">保存
        </div>
        <div style="height: 100%;display: flex;align-items: center;"
             @click="Cancel()">取消
        </div>
      </div>
    </div>
    <div style="display:flex;justify-content:space-around;">
      <span style="margin-left:5px;display:inline-block;font-size:10px;" @click="addCatalog()"><span
        class="iconfont icon-zengjia" style="display:block;text-align:center"></span>增加目录</span>
      <p style="line-height:45px;font-size:15px">操作</p>
    </div>
    <vux-group class="com-group-noMarginTop">
      <dir-item v-for="(item, index) in catalogList" :key="index"
                :title="item.catalog_name"
                :courses="item.courses"
                :catalogid="item.id"
                @addCourse="catalogid=>addCourse(catalogid)"
                @editCourse="editCourse(item.id,item.catalog_name)"
                @moveDown="catalogid=>moveDown(catalogid)"
                @moveUp="catalogid=>moveUp(catalogid)"
                @removeCourse="catalogid=>removeCourse(catalogid)"
      >
      </dir-item>

    </vux-group>


    <div>
      <confirm v-model="show_confirm"
               show-input
               ref="confirm"
               title="修改目录名"
               @on-cancel="onCancel"
               @on-confirm="onConfirm"
               @on-show="onShow"
               @on-hide="onHide"
      >
      </confirm>
    </div>


  </div>
</template>

<script>
  import {Cell, CellBox, CellFormPreview, Group, Badge, Confirm} from 'vux'
  import DirItem from '@c/cell/DirItem'

  export default {
    components: {
      Group,
      Cell,
      CellFormPreview,
      CellBox,
      Badge,
      DirItem,
      Confirm
    },
    data() {
      return {
        ill_id:'', //疾病ID
        plan_id: '',//学习计划id
        plan_name: '',//学习计划名称
        old_plan_name:'',//原始的计划名称
        catalogList: [], //目录列表
        catalogid: '', //目录id
        plan_name_edit_static: false, //修改学习计划状态
        show_confirm: false,
        catalog_name:'', //要修改的目录名
        catalog_id:'', //要修改的目录ID
      }
    },
    beforeRouteLeave(to, from, next) {
      if (to.name === 'learningplanCatalog') {
      }
      next()
    },
    mounted() {
      //获得路由传来的参数
      this.plan_id = this.$route.params.plan_id;
      this.old_plan_name = this.plan_name = this.$route.params.plan_name;
      this.ill_id = this.$route.params.ill_id;
      this.getPlanDetail();
    },
    methods: {

      onCancel(){ //取消
      },
      onConfirm(value){ //确定
        _request({
          url: 'doctorXxjhMulu/edit',
          method: 'post',
          params: {
            doctor_id: this.$store.state.user.userInfo.id,
            doctor_xxjh_id: this.plan_id,
            catalog_name: value,
            id:this.catalog_id,
          }
        }).then(ret => {
          this.$bus.$emit('vux.toast', '修改成功');
          this.getPlanDetail();
        })
      },
      onShow(){ //展示
        this.$refs.confirm.setInputValue(this.catalog_name)
      },
      onHide(){  //隐藏

      },


      //增加目录
      addCatalog() {
        _request({
          url: 'doctorXxjhMulu/edit',
          method: 'post',
          params: {
            doctor_id: this.$store.state.user.userInfo.id,
            doctor_xxjh_id: this.plan_id,
            catalog_name: '目录标题'
          }
        }).then(ret => {
          this.$bus.$emit('vux.toast', '添加成功');
          this.getPlanDetail();
        })
      },
      //修改学习计划名称
      SavePlanName() {
        if (!this.plan_name) {
          this.$bus.$emit("vux.toast", "名称不能为空");
          return;
        }
        let params = {
          id: this.plan_id,
          name: this.plan_name,
          doctor_id: this.$store.state.user.userInfo.id,
        };
        _request({
          url: "doctorXxjh/edit",
          method: "post",
          params: params
        }).then(ret => {
          this.$bus.$emit("vux.toast", "修改成功");
          this.old_plan_name = this.plan_name;
          this.plan_name_edit_static = !this.plan_name_edit_static;
        });
      },
      //取消修改
      Cancel(){
        this.plan_name = this.old_plan_name;
        this.plan_name_edit_static = !this.plan_name_edit_static;
      },


      //增加课程
      addCourse(catalogid) {
        console.log(`增加课程`)
        //      _request({
        //         url:'doctorXxjhCourse/createCourse',
        //         method:'post',
        //         params:{
        //            doctor_id:this.$store.state.user.userInfo.id,
        //            doctor_xxjh_mulu_id :this.catalog_id,
        //            article_ids:'',
        //            title:'',
        //            author:'',
        //         }
        //     }).then(ret =>{
        //         console.log(ret)
        //  })
      },
      //编辑目录
      editCourse(catalog_id,catalog_name) {
        this.catalog_id = catalog_id;
        this.catalog_name = catalog_name;
        this.show_confirm = true;
      },
      // 下移目录
      moveDown(catalogid) {
        _request({
          url: 'doctorXxjhMulu/moveMulu',
          method: 'post',
          params: {
            doctor_id: this.$store.state.user.userInfo.id,
            id: catalogid,
            oper: 'up',
          }
        }).then(ret => {
          this.$bus.$emit('vux.toast', '下移成功');
          this.getPlanDetail();
        })
      },
      // 上移目录
      moveUp(catalogid) {
        _request({
          url: 'doctorXxjhMulu/moveMulu',
          method: 'post',
          params: {
            doctor_id: this.$store.state.user.userInfo.id,
            id: catalogid,
            oper: 'down',
          }
        }).then(ret => {
          this.$bus.$emit('vux.toast', '上移成功');
          this.getPlanDetail();
        })
      },
      // 删除目录
      removeCourse(catalogid) {
        console.log('目录id' + catalogid)
        _request({
          url: 'doctorXxjhMulu/deleteById',
          method: 'post',
          params: {
            doctor_id: this.$store.state.user.userInfo.id,
            id: catalogid,
          }
        }).then(ret => {
          this.$bus.$emit('vux.toast', '删除成功');
          this.getPlanDetail();
          console.log(ret)
        })
      },
      // 初始化数据
      getPlanDetail() {
        _request({
          url: 'doctorXxjh/getById',
          method: 'get',
          params: {
            doctor_id: this.$store.state.user.userInfo.id,
            id: this.plan_id
          }
        }).then(ret => {
          this.catalogList = ret.data.ret.mulus
          this.catalogid = ret.data.ret.mulus.id
        })
      },
      toArticle() {
        this.$toView('learningArticle')
      },
      toEditCatalog() {
        this.$toView('learningplanEditCatalog')
      },
    },
  }
</script>
<style lang="less" scoped>
  .learningplanedit {
    background: white;
  }

  .plan-title {
    line-height: 40px;
    padding-left: 10px;
    font-size: 20px;
    overflow:hidden;
    white-space: nowrap;/*不换行*/
    text-overflow:ellipsis;/*超出部分文字以...显示*/
  }
  .plan-title-input {
    line-height: 40px;
    padding-left: 10px;
    font-size: 20px;
  }

  ul {
    list-style: none;
    border: 1px solid #ccc;

    > li {
      height: 50px;

      padding: 0 20px;
      border-bottom: 1px solid #ccc;
    }
  }
</style>
