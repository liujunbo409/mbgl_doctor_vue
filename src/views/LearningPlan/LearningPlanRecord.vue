<template>
    <div>
        <vue-header title="音频录制"></vue-header>
          <div class="home">
    <h1 @click="handleclick()">开始录音</h1>
    <h1 @click="handleclickl()">继续录音</h1>
    <h1 @click="handleclicks()">结束录音</h1>
    <h1 @click="handleclickp()">录音播放</h1>
  </div>
    </div>
</template>
<script>
import Recorder from 'js-audio-recorder'
let recorder = new Recorder()
export default {
  name: 'home',
  methods: {
    handleclick () {
      console.log(1)
      recorder.start()// 开始录音
    },
    handleclickl () {
      console.log(2)
      recorder.resume()// 继续录音
    },
    handleclicks () {
      console.log(3)
      recorder.stop() // 结束录音
    },
    handleclickp () {
      console.log(4)
      recorder.play() // 录音播放
    }
  }
}
</script>