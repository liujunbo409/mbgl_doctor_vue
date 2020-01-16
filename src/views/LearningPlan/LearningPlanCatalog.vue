<template>

  <div class="learningplancatalog">
    <vue-header title="学习计划 目录设置"></vue-header>
    <div class="plan-title">{{ill_name}}学习计划</div>
    <div class="com-input-container">
      <input type="text" placeholder="新建学习计划" v-model="text">
      <span class="searchBtn" @click="createLearningPlan()">新建</span>
    </div>
    <ul>
      <li v-for="(item,id) in plan_list" :key="id" class="plan-list">{{item.name}}
        <span class="plandelete" @click="removeLearningPlan(item)">删除</span>
        <span @click="copyLearningPlan(item)">复制</span>
        <span @click="editLearningPlan(item)">编辑</span>
      </li>
    </ul>


  </div>

</template>
<script>

  export default {
    data() {
      return {
        ill_id: '',  //疾病ID
        ill_name: '', //疾病名成
        plan_list: [], //学习计划数据
        text: '',//input数据

      }
    },

    mounted() {
      //获得路由传来的参数
      this.ill_id = this.$route.params.ill_id;
      this.ill_name = this.$route.params.ill_name;
      console.log(`this.ill_id == ${this.ill_id};;this.ill_name==${this.ill_name}`)
      this.getplanList();

    },
    methods: {
      //请求学习计划列表
      getplanList() {
        _request({
          url: 'doctorXxjh/getListByCon',
          params: {
            doctor_id: this.$store.state.user.userInfo.id,
            ill_id: this.ill_id,
            doctor_type: this.$store.state.user.userInfo.role == 'doctor' ? '0' : '1',
          }
        }).then(({data: {ret}}) => {
          this.plan_list = ret.data;
          console.log(`this.plan_list == ${JSON.stringify(this.plan_list[0])}`)
        })
      },
      //创建学习计划
      createLearningPlan() {
        _request({
          url: 'doctorXxjh/edit',
          method: 'post',
          params: {
            doctor_id: this.$store.state.user.userInfo.id,
            doctor_type: this.$store.state.user.userInfo.role == 'doctor' ? '0' : '1',
            name: this.text,
            ill_id: this.ill_id,
          }

        }).then(ret => {
          console.log(`ret == ${JSON.stringify(ret.data.ret)}`)
          this.$bus.$emit('vux.toast', '创建成功');
          //  let temp = {
          //     "id":ret.data.ret.id,
          //     "doctor_id":ret.data.ret.doctor_id,
          //     "name":ret.data.ret.name,
          //     "doctor_type":ret.data.ret.doctor_type,
          //     "ill_id":ret.data.ret.ill_id,
          // }
          // this.plan_list.unshift(temp);
          this.getplanList();
        })

      },
      //删除选中的学习计划
      removeLearningPlan(item) {
        _request({
          url: 'doctorXxjh/deleteById',
          method: 'post',
          params: {
            doctor_id: this.$store.state.user.userInfo.id,
            id: item.id
          }
        }).then(ret => {
          console.log(`ret == ${JSON.stringify(ret)}`)
          this.$bus.$emit('vux.toast', '删除成功');
          this.getplanList();
        })

      },
      //复制选中的学习计划
      copyLearningPlan(item) {
        _request({
          url: 'doctorXxjh/copy',
          method: 'post',
          params: {
            doctor_id: this.$store.state.user.userInfo.id,
            id: item.id
          }

        }).then(ret => {
          console.log(`ret == ${JSON.stringify(ret)}`)
          this.$bus.$emit('vux.toast', '复制成功');
          this.getplanList();
        })
      },
      //编辑选中的学习计划
      editLearningPlan(item) {
        console.log(item)
        this.$toView('learningplanEdit', {
          params: {
            plan_id: item.id,
            plan_name: item.name
          }
        })
      },
    }
  }
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
    font-size: 18px;
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
