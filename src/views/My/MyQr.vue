<template>
  <div class="com-container">
    <vue-header title="我的二维码"></vue-header>
    <div style="width: 100%;height:90vh;display: flex;justify-content: center;align-items: center;" v-if="show_flag">
      <me-qrcode
        :qr-url="user.qr_url"
        :qr-size='300' :qr-text-size='24' :qr-text="user.real_name" :user_id="user.id" style="margin-bottom: 100px;"
        ref='a'></me-qrcode>
      <br>
    </div>
  </div>
</template>

<script>
    import meQrcode from '@c/MyQr/MyQrCode';

    export default {
        components: {
            meQrcode
        },
        data() {
            return {
                show_flag: false,
                user: null,
            }
        },
        mounted() {
            this.MyQr();
        },
        methods: {
            MyQr() {
                _request({
                    url: 'my/getById',
                    method: 'get',
                }).then(res => {
                    res.data.ret.qr_url = `${doctor_qr_url + res.data.ret.id}&autoFollow=true`;
                    this.user = res.data.ret;
                    this.show_flag = true;
                });
                // console.log(JSON.stringify(this.$store.state.user.userInfo.qr_url));
                // let user_info = this.$store.state.user.userInfo.qr_url;
            },
        }
    }
</script>

<style scoped>

</style>
