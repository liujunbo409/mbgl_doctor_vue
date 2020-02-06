<template>
  <div class="learningplancatalog">
    <vue-header title="学习计划 目录设置"></vue-header>
    <div class="plan-title">{{ill_name}}学习计划</div>
    <div class="com-input-container">
      <input type="text" placeholder="学习计划名称" v-model="text"/>
      <span class="searchBtn" @click="createLearningPlan()">新建</span>
    </div>
    <div>
      <div style="margin: 5px 0">我的学习计划</div>
      <ul v-if="my_plan_list.length">
        <li v-for="(item,id) in my_plan_list" :key="id" class="plan-list">
          {{item.name}}
          <span class="plandelete" @click="removeLearningPlan(item)">删除</span>
          <span @click="copyLearningPlan(item)">复制</span>
          <span @click="editLearningPlan(item,'Edit')">编辑</span>
        </li>
      </ul>
      <ul v-else>
        暂时没有我的学习计划
      </ul>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        ill_id: "", //疾病ID
        ill_name: "", //疾病名成
        plan_list: [], //学习计划数据
        text: "", //input数据
        my_plan_list: [], //我的学习计划
      };
    },

    mounted() {
      //获得路由传来的参数
      this.ill_id = this.$route.query.ill_id;
      this.ill_name = this.$route.query.ill_name;
      console.log(
        `this.ill_id == ${this.ill_id};;this.ill_name==${this.ill_name}`
      );
      this.getplanList();
    },
    methods: {
      //请求学习计划列表
      getplanList() {
        this.my_plan_list = [];

        _request({
          url: "doctorXxjh/getListByCon",
          params: {
            doctor_id: this.$store.state.user.userInfo.id,
            ill_id: this.ill_id,
            doctor_type: this.$store.state.user.userInfo.role == "doctor" ? "0" : "1"  //根据医生类别进行传值
          }
        }).then(({data: {ret}}) => {
          this.plan_list = ret.data;
          console.log(`this.plan_list == ${JSON.stringify(this.plan_list[0])}`);
          console.log(`this.$store.state.user.userInfo.id== ${this.$store.state.user.userInfo.id}`);
          ret.data.forEach(item => {
            item.doctor_id == this.$store.state.user.userInfo.id ? this.my_plan_list.push(item) : '';
          })
        });
      },
      //创建学习计划
      createLearningPlan() {
        _request({
          url: "doctorXxjh/edit",
          method: "post",
          params: {
            doctor_id: this.$store.state.user.userInfo.id,
            doctor_type:
              this.$store.state.user.userInfo.role == "doctor" ? "0" : "1",
            name: this.text,
            ill_id: this.ill_id
          }
        }).then(ret => {
          console.log(`ret == ${JSON.stringify(ret.data.ret)}`);
          this.$bus.$emit("vux.toast", "创建成功");
          this.text = '';
          this.getplanList();
        });
      },
      //删除选中的学习计划
      removeLearningPlan(item) {
        _request({
          url: "doctorXxjh/deleteById",
          method: "post",
          params: {
            doctor_id: this.$store.state.user.userInfo.id,
            id: item.id
          }
        }).then(ret => {
          if (ret.data.code == "902") {
            this.$bus.$emit("vux.toast", "只能删除自己的数据");
            return;
          }
          this.$bus.$emit("vux.toast", "删除成功");
          this.getplanList();
        });
      },
      //复制选中的学习计划
      copyLearningPlan(item) {
        _request({
          url: "doctorXxjh/copy",
          method: "post",
          params: {
            doctor_id: this.$store.state.user.userInfo.id,
            id: item.id
          }
        }).then(ret => {
          console.log(`复制请求成功回调ret == ${JSON.stringify(ret)}`);
          if (ret.data.code == 902) {
            this.$bus.$emit("vux.toast", "复制失败");
            return;
          }
          this.$bus.$emit("vux.toast", "复制成功");
          this.getplanList();
        });
      },
      //编辑选中的学习计划
      editLearningPlan(item,type='') {
        console.log(item);
        this.$toView("learningplanEdit", {
          params: {
            plan_id: item.id,
            plan_name: item.name
          }
        });
      }
    }
  };
</script>
<style lang="less" scoped>
  .learningplancatalog {
    background: white;
  }

  .plan-title {
    line-height: 40px;
    padding-left: 10px;
  }

  .com-input-container {
    background-color: white;
    width: 100%;
    display: flex;
    height: 30px;
    border-top: 1px #ccc solid;

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

  .plan-list {
    border-bottom: 1px solid #ccc;
    height: 40px;
    line-height: 40px;
    font-size: 15px;
    padding-left: 15px;

    > span {
      font-size: 15px;
      float: right;
      margin-right: 15px;
      color: blue;
    }

    > .plandelete {
      color: red;
    }
  }
</style>
