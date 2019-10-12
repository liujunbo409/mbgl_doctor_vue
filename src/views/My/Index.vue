<template>
  <div class="com-container">
    <vue-header title="我的"></vue-header>
    <vux-group class="com-group-noMarginTop">
      <vux-cell title="个人信息" :is-link="true" link="/my/info"></vux-cell>
      <vux-cell title="帐号管理" :is-link="true" link="/my/account"></vux-cell>
      <vux-cell title="资格认证" :is-link="true" link="/my/role"></vux-cell>
    </vux-group>

    <vux-group>
      <vux-cell title="反馈" :is-link="true" link="/my/feedback"></vux-cell>
    </vux-group>


    <vux-group>
      <vux-cell style="color: red;" title="退出登录" @click.native="logOut"></vux-cell>
    </vux-group>

  </div>
</template>

<script>


    export default {
        data() {
            return {}
        },

        methods: {
            logOut() {
                let data = {
                    fwh_openid: this.$store.state.user.userInfo.fwh_openid,
                };
                _request({
                    url: `login/logOut`,
                    method: 'post',
                    data: data
                }).then(({data}) => {
                    if (data.result) {
                        this.$bus.$emit('vux.alert', '登出成功');
                        localStorage.clear();
                        this.$store.commit('user/clear');
                        this.$store.commit('baseIllList/clear');
                        // this.$store.state.constText = {};
                        // this.$store.state.hospList = {};
                        this.$toView('login');
                    } else {
                        this.$bus.$emit('vux.toast', '好像哪里不对');
                    }
                })
            }
        }
    }
</script>

<style lang="less" scoped>

</style>
