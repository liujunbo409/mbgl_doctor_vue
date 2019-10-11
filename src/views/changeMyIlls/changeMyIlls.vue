<template>
  <div class="com-container">
    <vue-header title="选择疾病"></vue-header>
    <div v-if="show_flag" style="width: 100%;">
      <p class="title">已选择疾病（点击删除）</p>
      <div class="options">
        <div class="item selected" v-for="(item, index) in selected" :key="index"
             @click="remove(item)"
        >{{ item.name }}
        </div>
      </div>
      <p class="title">未选择疾病（点击添加）</p>
      <div class="options">
        <div class="item" v-for="(item, index) in options" :key="index"
             @click="add(item)"
        >{{ item.name }}
        </div>
      </div>
      <div class="com-mainBtn-container">
        <x-button text="确定" @click.native="submit()"></x-button>
      </div>
    </div>
  </div>
</template>

<script>
    import {XButton} from 'vux'

    export default {
        components: {
            XButton
        },
        props: {
            role: {},
        },
        data() {
            return {
                show_flag: false,
                options: [], //未选中疾病
                selected: [], //选中疾病
                jiao_xue_ji_bing_Data: [], //获取当前科室下所有教学疾病
                ke_shi: null,
                jiao_xue_ji_bing: [],   // 已经选择的疾病组ID
            }
        },
        mounted() {
            this.yi_yuan_Data();
        },
        methods: {
            //删除选中
            remove(item) {
                this.options.push(item);
                this.selected.some((val, ind) => {
                    if (item.id === val.id) {
                        this.selected.splice(ind, 1);
                        return true
                    }
                })
            },
            //添加选中
            add(item) {
                this.selected.push(item);
                this.options.some((val, ind) => {
                    if (item.id === val.id) {
                        this.options.splice(ind, 1);
                        return true
                    }
                })
            },
            //提交修改
            submit() {
                //this.jiao_xue_ji_bing_Data = data.ret.map(val => ({name: val.name, id: val.id}))
                let ill_ids = this.selected.map(val => val.id).join('&');
                let data = {
                    ill_ids: ill_ids
                };
                console.log(`data=${JSON.stringify(data.ill_ids)}`);
                _request({
                    url: `changeMyIlls/changeMyIlls`,
                    method: 'post',
                    data: data
                }).then(({data}) => {
                    if (data.result) {
                        this.$bus.$emit('vux.alert', '上传成功');
                    } else {
                        this.$bus.$emit('vux.toast', data.message);
                    }
                })
            },

            //获取信息
            yi_yuan_Data() {
                // console.log(this.$store.state.user.userInfo.role);  //获取角色(医生or护士)
                _request({
                    url: `apply/${this.$store.state.user.userInfo.role}Apply`
                }).then(({data}) => {
                    if (data.result) {
                        var {ret} = data;
                        this.ke_shi = ret.department_id_cache ? ret.department_id_cache : ''; //获取科室ID取当下的所有教学疾病
                        console.log(`this.ke_shi = ${this.ke_shi}`);
                        this.jiao_xue_ji_bing = ret.ill_ids ? ret.ill_ids.toString().split('&') : [];//已选择的教学疾病
                    }
                    let req = () => {
                        return _request({
                            url: 'apply/departmentIllList',
                            params: {
                                department_id: this.ke_shi
                            }
                        }).then(({data}) => {
                            if (data.result) {
                                this.jiao_xue_ji_bing_Data = data.ret.map(val => ({name: val.name, id: val.id}))
                            }
                            this.jiao_xue_ji_bing = this.jiao_xue_ji_bing.map(val => parseInt(val));
                            this.jiao_xue_ji_bing_Data.forEach(option => {
                                if (this.jiao_xue_ji_bing.includes(option.id)) {
                                    this.selected.push(option);
                                } else {
                                    this.options.push(option);
                                }
                            });
                        })
                    };
                    this.show_flag = true;
                    // 出错后再试一次
                    req().catch(e => {
                        console.log(e);
                        req()
                    });
                })
            },
        }
    }
</script>

<style scoped>
  .options {
    min-height: 43px;
    background-color: white;
    padding: 5px 10px;
  }

  .item {
    display: inline-block;
    padding: 5px 15px;
    border: 1px #ccc solid;
    border-radius: 20px;
    margin: 5px;
  }

  .selected {
    background-color: #03A9F4;
    color: white;
  }
</style>
