<template>
  <cell-box :is-link="true" v-if="ret">
    <div class="container">
      <p class="title">{{ art.title }}</p>
      <div class="info">
        <div class="count">
          <div class="category">{{ ret.ill_name }}</div>
          <div class="watched icon">{{ artData.doctor_show_num + artData.user_show_num }}</div>
          <div class="good icon">{{ artData.accept_num }}</div>
          <div class="star icon">{{ artData.used_num }}</div>
        </div>
        <div class="meiTi">
          <div class="hasVideo icon" v-if="art.video_url !== null">视频</div>
          <div class="hasAudio icon" v-if="art.voice_url !== null">音频</div>
          <div class="hasWord icon">文稿</div>
        </div>
      </div>
    </div>
  </cell-box>
</template>

<script>
import { CellBox } from 'vux'
export default {
  components: {
    CellBox
  },

  props: ['ret'],

  data (){
    return {

    }
  },

  computed: {
    art (){
      return this.ret.article
    },

    artData (){
      return this.ret.article_data || this.ret.data
    }
  },

  methods: {

  }
}
</script>

<style lang="less" scoped>
.container{
  width: 100%;
  height: 100%;

  .title{
    width: 80%;
    flex-basis: 100%;
    line-height: 1.6;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .info{
    width: 100%;
    display: flex;
    justify-content: space-between;
    font-size: 13px;
    white-space: nowrap;

    @media screen and (max-width: 330px) {
      font-size: 12px;
    }

    .count, .meiTi{
      display: flex;
    }

    .meiTi{
      margin-right: 20px;
    }

    .icon{
      background-size: 1em;
      background-repeat: no-repeat;
      background-position: left center;
      padding-left: 1.2em;
      margin-left: 5px;
    }

    .category{
      font-size: #c6c6c6;
      margin-right: 3px;
    }

    .watched{
      background-image: url('~@img/sub/eye.png');
    }
    .good{
      background-image: url('~@img/sub/good.png');
    }
    .star{
      background-image: url('~@img/sub/star.png');
    }
    .hasAudio{
      background-image: url('~@img/sub/audio.png');
    }
    .hasVideo{
      background-image: url('~@img/sub/video.png');
    }
    .hasWord{
      background-image: url('~@img/sub/word.png');
    }
  }
}


</style>
