<template>
  <div class="container">
    <audio :src="src" ref="audio" style="display:none;" 
      @durationchange="ready"
      @error="status = 'error'"
    ></audio>
    <div>
      <span class="time">{{ now | time }}/{{ length | time }}</span>
      <div class="btn">
        <img src="@img/btn/stop.png" v-if="status === 'play'" @click="pause">
        <img src="@img/btn/play.png" v-if="status === 'pause'" @click="play">
        <img src="@img/btn/reload.png" v-if="status === 'error'" @click="reload">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['src'],

  data (){
    return {
      now: 0,
      length: 0,
      status: 'pause',
      loadStatus: 'init',
      refreshIntervalKey: 0
    }
  },

  filters: {
    time (val){
      var int = Math.round(val)
      var minute = Math.floor(int / 60)
      var second = (int % 60).toString()
      if(second.length < 2){
        second = 0 + second
      }
      return minute + ':' + second
    }
  },

  computed: {
    audio (){
      return this.$refs.audio
    }
  },

  methods: {
    ready (){
      this.length = this.audio.duration
      this.loadStatus = 'ready'
    },

    pause (){
      if(this.loadStatus !== 'ready'){
        this.$bus.$emit('vux.toast', '音频还未加载完成，请稍候')
        return
      }

      this.status = 'pause'
      this.audio.pause()
    },

    play (){
      if(this.loadStatus !== 'ready'){
        this.$bus.$emit('vux.toast', '音频还未加载完成，请稍候')
        return
      }

      this.refreshIntervalKey = setInterval(() =>{
        this.now = this.audio.currentTime
        if(this.length === this.now){
          this.pause()
        }
      }, 200)

      this.status = 'play'
      this.audio.play()
    },

    reload (){
      clearInterval(this.refreshIntervalKey)
      this.audio.load()
    }
  }
}
</script>

<style lang="less" scoped>
.container{
  margin: 5px;
  display: inline-block;

  .time, .btn{
    display: inline-block;
    vertical-align: middle;
  }

  .time{
    font-size: 16px;
    margin-right: 5px;
  }

  .btn{
    position: relative;
    top: 2px;
  }
}




</style>
