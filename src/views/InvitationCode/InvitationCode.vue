<template>
  <div>
    <vue-header title="邀请码"></vue-header>
    <div v-if="show_flag">
      <div v-if="invitation_codes.length === 0" style="display: flex;justify-content: center;margin-top: 50px;">
        请点击下方生成邀请码
      </div>
      <vux-group v-else class="com-group-noMarginTop">
        <vux-cell v-for="(invitation_code,index) in invitation_codes" :key="index"
                  :title="invitation_code.invite" @click.native="sendCode(invitation_code.id)">
          <span style="color: #03A9F4;">确定发送</span>
        </vux-cell>
      </vux-group>
      <div style="width: 100%;display: flex;justify-content: center;" v-if="invitation_codes.length !== 0">
        <div class="pager" style="width: 80%;display: flex;justify-content: space-between;">
          <a @click="firstPage()">首页</a>
          <a @click="prevPage()">上一页</a>
          <span>{{page}}/{{last_page}}</span>
          <a @click="nextPage()">下一页</a>
          <a @click="lastPage()">尾页</a>
        </div>
      </div>
    </div>
    <div style="width: 100%;height: 85px;"></div>
    <div class="mainBtn-container">
      <x-button @click.native="creatInvite()">生成邀请码</x-button>
    </div>
  </div>
</template>

<script>
    import {XButton} from 'vux'

    export default {
        components: {
            XButton
        },
        data() {
            return {
                invitation_codes: [], //用户产生的邀请码
                page: 1, //分页
                last_page: 1, //最大页数
                show_flag: false,
            }
        },
        mounted() {
            //初始化
            this.getUserProduceCode();
        },
        methods: {

            //获取用户下未发送的邀请码
            getUserProduceCode() {
                _request({
                    url: 'invite/getListByCon',
                    // method: 'post',
                    params: {
                        tab: 0,
                        page: 1,
                    }
                }).finally(this.$vux.loading.hide).then(({data}) => {
                    this.last_page = data.ret.last_page;
                    this.invitation_codes = data.ret.data;
                    this.show_flag = true;
                });
            },
            //生成邀请码
            creatInvite() {
                _request({
                    url: 'invite/creatInvite',
                    method: 'post',
                    params: {
                        num: 5
                    }
                }).then(({data}) => {
                    // this.invitation_codes = this.invitation_codes.concat(data);
                    this.getUserProduceCode();
                })
            },
            //发送邀请码
            sendCode(id) {
                _request({
                    url: 'invite/editInvite',
                    method: 'post',
                    params: {
                        id: id,
                        tab: 1,
                    }
                }).then(({data}) => {
                    this.$bus.$emit('vux.toast', {type: 'success', text: '修改成功'});
                    this.pageInvire(this.page);
                })

            },
            firstPage() { //首页
                this.pageInvire(1);
            },
            prevPage() {  //上一页
                if (this.page === 1) {
                    this.$bus.$emit('vux.toast', {type: 'text', text: '已经是第一页了'});
                    return;
                }
                this.pageInvire(this.page - 1);
            },
            nextPage() {  //下一页
                if (this.page === this.last_page) {
                    this.$bus.$emit('vux.toast', {type: 'text', text: '已经是最后页了'});
                    return;
                }
                this.pageInvire(this.page + 1);
            },
            lastPage() { //尾页
                this.pageInvire(this.last_page);
            },
            pageInvire(num) {
                this.page = num;
                _request({
                    url: 'invite/getListByCon',
                    // method: 'post',
                    params: {
                        tab: 0,
                        page: num,
                    }
                }).finally(this.$vux.loading.hide).then(({data}) => {
                    this.invitation_codes = data.ret.data;
                })
            },
        },
    }
</script>

<style scoped>
  .mainBtn-container {
    position: absolute;
    bottom: 0;
    width: 100%;
  }
  .pager {
    width: 600px;
    margin: 0 auto;
    margin-top: 10px;
    height: 48px;
    line-height: 48px;
    margin-bottom: 40px;
  }
  .pager a {
    color: black;
    font-weight: bold;
    text-decoration: none;
  }
  .pager a:hover {
    color: #03A9F4;
  }
</style>
