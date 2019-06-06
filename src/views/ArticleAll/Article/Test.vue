<template>
  <div class="com-container">
    <vue-header title="考核问题"></vue-header>
    <view-box>
      <main v-if="list.length">
        <div v-for="({question, answers, resolve, id}, index) in list" :key="index" class="testBox">
          <p class="title">问题{{ index + 1 }}：{{ question }}</p>
          <ol type="A" class="options" :ref="id">
            <li v-for="(option, index) in answers.split('&&')" :key="index">{{ option }}</li>
          </ol>
          <p class="resolve">
            <img src="@img/sub/info.png" width="20px">
            <span>解析：{{ resolve }}</span> 
          </p>
        </div>
      </main>
      <div class="noData" v-else>暂无考核问题</div>
    </view-box>
    <div class="com-ab-center com-reloadBtn" @click="load" v-if="status === 'error'">重新加载</div>
  </div>
</template>

<script>
import { Icon } from 'vux'
export default {
  components: {
    VuxIcon: Icon
  },

  data (){
    return {
      id: '',
      status: 'init',
      list: [],
      answerDraw: {}
    }
  },
  
  mounted (){
    this.id = this.$route.params.id
    this.load()
  },

  methods: {
    // 加载问题
    load (){
      this.status = 'loading'
      this.$bus.$emit('vux.spinner.show')
      _request({
        url: 'article/question',
        params: {
          article_id: this.id
        }
      }).then(({data}) =>{
        this.$bus.$emit('vux.spinner.hide')
        this.status = 'success'
        this.list = data.ret
        
        data.ret.forEach(val =>{
          this.answerDraw[val.id] = val.answer.split(',')
        })
        Vue.nextTick(() =>{
          for(let key in this.answerDraw){
            this.answerDraw[key].forEach(ind =>{
              this.$refs[key][0].children[ind].classList.add('check')
            })
          }
        })
      }).catch(e =>{
        this.status = 'error'
        this.$bus.$emit('vux.spinner.hide')
        console.log(e)
        this.$bus.$emit('vux.toast', {
          type: 'cancel',
          text: '网络错误'
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.testBox{
  margin: 10px;
  margin-bottom: 35px;

  .title{
    font-size: 16px;
  }

  .resolve{
    font-size: 16px;
    margin-top: 5px;

    > *{
      vertical-align: middle;
    }
  }

  .options{
    padding-left: 40px;
    margin-top: 10px;

    > li{
      line-height: 2;
      position: relative;
    }
  }
}

.noData{
  position: fixed;
  top: calc(~'50% + 22px');
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 22px;
  color: #666;
}

.check::after{
  content: '';
  width: 20px;
  height: 20px;
  background-image: url('~@img/sub/check.png');
  background-repeat: no-repeat;
  background-size: 20px;
  position: absolute;
  top: 4px;
  left: -40px;
}
</style>
