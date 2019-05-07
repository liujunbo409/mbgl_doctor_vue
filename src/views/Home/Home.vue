<template>
  <div class="com-container">
    <vue-header title="首页" :visibleBackBtn="false" :visibleHomeBtn="false"></vue-header>
    <vux-grid :col="3" :cols="3" class="body">
      <grid-item v-for="({link, img, text, badge}, index) in blocks" :key="index"
        @click.native="$toView(link)" :label="text"
      >
        <img slot="icon" :src="img">
      </grid-item>
    </vux-grid>
  </div>
</template>

<script>
import { Grid, GridItem } from 'vux'

function title(text){
  return {
    text,
    img: require(`@img/home/${text}.png`)
  }
}

export default {
  components: {
    VuxGrid: Grid,
    GridItem
  },

  data (){
    return {
      blocks: [
        {
          ...title('个人资料'),
          link: 'my'
        }, {
          ...title('医生认证'),
          link: 'attestation'
        }, {
          ...title('出诊计划'),
          link: 'visiting'
        }, {
          ...title('审核文章'),
          link: 'article_auditing'
        }, {
          ...title('全部文章'),
          link: 'article_all'
        }, {
          ...title('收藏文章'),
          link: 'article_favorites',
        }, {
          ...title('审核问答'),
          link: 'qa_auditing'
        }, {
          ...title('全部问答'),
          link: 'qa_all'
        }, {
          ...title('收藏问答'),
          link: 'qa_favorites'
        }
      ]
    }
  },

  methods: {

  }
}
</script>

<style lang="less" scoped>
.body{
  background-color: white;
}
</style>
