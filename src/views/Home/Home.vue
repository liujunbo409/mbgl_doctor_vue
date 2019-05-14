<template>
  <div class="com-container">
    <vue-header title="首页" :visibleBackBtn="false" :visibleHomeBtn="false"></vue-header>
    <vux-grid :col="3" :cols="3" class="body"
      :show-lr-borders="false"
      :show-vertical-dividers="false"
    >
      <grid-item v-for="({link, img, text, badge, badgeClass}, index) in blocks" :key="index"
        @click.native="$toView(link)" :label="text"
      >
        <img slot="icon" :src="img">
        <div v-if="badge" slot="icon" class="badge" :class="badgeClass">{{ badge }}</div>
      </grid-item>
    </vux-grid>
  </div>
</template>

<script>
import { Grid, GridItem } from 'vux'
import { mapState } from 'vuex'

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
      // 渲染主体
      blocks: [
        {
          ...title('个人资料'),
          link: 'my',
          badge: '',
          badgeClass: ''
        }, {
          ...title('医生认证'),
          link: 'my/role/doctor',
          badge: '',
          badgeClass: ''
        }, {
          ...title('出诊计划'),
          link: 'visitplan',
          badge: '',
          badgeClass: 'chuzhen chuzhen-has'
        }, {
          ...title('审核文章'),
          link: 'article_assess'
        }, {
          ...title('全部文章'),
          link: 'article_all'
        }, {
          ...title('收藏文章'),
          link: 'article_favorites',
        }, {
          ...title('审核问答'),
          link: 'qa_assess'
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

  activated (){
    this.updateEidtStatus()
    this.updateShenHeStatus()
  },

  computed: {
    ...mapState('user/editStatus', {
      infoStatus: 'info',
      applyStatus: 'apply',
      czsjStatus: 'czsj'
    }),

    ...mapState('user/shenHeStatus', {
      shenHeStatusStr: 'doctor'
    })
  },

  watch: {
    // 监听各状态变化
    infoStatus (){
      this.updateEidtStatus()
    },

    shenHeStatusStr (){
      this.updateShenHeStatus()
    }
  },

  methods: {
    updateEidtStatus (){
      this.blocks[0].badge = this.infoStatus ? '完成' : '待填写'
      this.blocks[0].badgeClass = this.infoStatus ? 'info-done' : 'info-blank'
      this.blocks[2].badge = this.czsjStatus
    },

    updateShenHeStatus (){
      var val = this.shenHeStatusStr
      this.blocks[1].badge = val
      switch(val){
        case '未提交': {
          this.blocks[1].badgeClass = 'shenhe-nosubmitted'
          break
        }
        case '待审核': {
          this.blocks[1].badgeClass = 'shenhe-ing'
          break
        }
        case '通过': {
          this.blocks[1].badgeClass = 'shenhe-done'
          break
        }
        case '驳回': {
          this.blocks[1].badgeClass = 'shenhe-rejected'
          break
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.body{
  background-color: white;
}

/deep/ .weui-grid__icon{
  position: relative;
}

.badge{
  position: absolute;
  bottom: 0;
  line-height: 1;
  left: 50%;
  white-space: nowrap;
  padding: 3px 5px;
  color: white;
  border-radius: 10px;
  transform: translateY(50%);
}

.info-done{
  background-color: rgb(42, 214, 31);
}
.info-blank{
  background-color: #ccc;
}

.shenhe-nosubmitted{
  background-color: #ccc;
}
.shenhe-ing{
  background-color: #03a9f4;
}
.shenhe-done{
  background-color: #2ad61f;
}
.shenhe-rejected{
  background-color: #f51f1f;
}

.chuzhen{
  transform: translate(-50%, 50%);
}
.chuzhen-has{
  background-color: #2ad61f;
  
}

/deep/ .weui-grid__icon + .weui-grid__label{
  margin-top: 10px;
}

// 干掉组件默认边框
/deep/ .weui-grid::after{
  display: none;
}
</style>
