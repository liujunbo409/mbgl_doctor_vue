<template>
  <div class="com-container">
    <div class="top_text">
      <p class="evey_txtone">恭喜您提问成功</p>
      <p class="evey_txt">您可以在我的提问中查看到此问题</p>
      <p class="evey_txt">问题得到回复我们及时通知您!</p>
    </div>
    <img class="woman_doctor" src="@img/home/woman_doctor.png" alt="">
    <div class="btn-isee" @click="toOpenQA">我知道了</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      timeoutKey: 0
    }
  },

  mounted (){
    this.timeoutKey = setTimeout(this.toOpenQA, 3000)
  },

  methods: {
    toOpenQA (){
      clearTimeout(this.timeoutKey)
      this.$router.replace({ name: 'open_qa' })
    }
  }
}
</script>

<style lang="less" scoped>
.com-container {
  background-color: #02adf9;
  text-align: center;
}
.top_text{
  font-size: 20px;
}
.evey_txtone{
  padding-top: 50px;
}
.evey_txt {
  margin-top: 20px;
}
.woman_doctor{
  width: 80%;
  padding-top: 13px;
}
.btn-isee{
  @height: 40px;
  height: @height;
  line-height: @height;
  color: white;
  font-size: 20px;
  width: 60%;
  background-color: #FFA000;
  border-radius: 20px;
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
}
</style>
