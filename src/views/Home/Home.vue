<template>
  <div class="com-container">
    <vue-header title="首页" :visibleBackBtn="false" :visibleHomeBtn="false"></vue-header>
    <vux-grid :col="3" :cols="3" class="body"
      :show-lr-borders="false"
      :show-vertical-dividers="false"
    >
      <grid-item v-for="({link, img, text, badge, badgeClass, hide}, index) in blocks" :key="index"
        @click.native="$toView(link)" :label="text" :class="{ hide }"
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
          text: `医生认证`,   //  这里提供一个默认值，在读取到身份后会被立即修改
          img: require('@img/home/医生认证.png'), 
          link: `my/role/doctor`,
          badge: '',
          badgeClass: '',
        }, {
          ...title('出诊计划'),
          link: 'visitplan',
          badge: '',
          badgeClass: 'chuzhen chuzhen-has',
          hide: false
        }, {
          ...title('审核文章'),
          link: 'article_assess',
          badge: '',
          badgeClass: 'color-danger-bg assessBadge'
        }, {
          ...title('全部文章'),
          link: 'article_all'
        }, {
          ...title('收藏文章'),
          link: 'article_favorites',
        },
        
        // {
        //   ...title('全部问答'),
        //   link: 'all_qa'
        // }, {
        //   ...title('审核问答'),
        //   link: 'qa_assess'
        // }, {
        //   ...title('收藏问答'),
        //   link: 'collection_qa',
        // }, {
        //   ...title('公开问答'),
        //   link: 'open_qa'
        // }, {
        //   ...title('我的提问'),
        //   link: 'my_question'
        // }
      ]
    }
  },

  beforeRouteLeave (to, from, next){
    if(!['my', 'my/role/doctor', 'my/role/nurse'].includes(to.name) && !this.isAccess){
      this.$bus.$emit('vux.alert', '您还没有进入该模块的权限，请先完成身份认证！')
      return
    }
    next()
  },

  activated (){
    this.changeRole()
    this.updateEidtStatus()
    this.updateShenHeStatus()
    this.$store.dispatch('user/editStatus/get')
    this.$store.dispatch('user/getAccess')

    // 获取待审核文章数
    _request({
      url: 'article/shenhe/waitNum',
      params: {
        role: this.$store.state.user.userInfo.role
      }
    }).then(({data}) =>{
      if(data.result && data.ret){
        this.blocks[3].badge = data.ret
      }
    })
  },

  computed: {
    role (){
      return this.$store.state.user.userInfo.role
    },

    // 是否允许进入其他模块
    isAccess (){
      return this.$store.state.user.access
    },

    roleStr (){
      return {
        doctor: '医生',
        nurse: '护士'
      }[this.role]
    },


    ...mapState('user/editStatus', {
      infoStatus: 'info',
      applyStatus: 'apply',
      czsjStatus: 'czsj'
    }),

    shenHeStatus (){
      var {role} = this.$store.state.user.userInfo
      return this.$store.state.user.userInfo[role + '_status']
    }
  },

  watch: {
    // 监听各状态变化
    role (){
      this.changeRole()
    },

    infoStatus (){
      this.updateEidtStatus()
    },
    applyStatus (){
      this.updateEidtStatus()
    },
    czsjStatus (){
      this.updateEidtStatus()
    },

    shenHeStatusStr (){
      this.updateShenHeStatus()
    }
  },

  methods: {    
    changeRole (){
      this.blocks[1].text = this.roleStr + '认证'
      this.blocks[1].link = 'my/role/' + this.role
      if(this.role === 'doctor'){
        this.blocks[2].hide = false
      }
      if(this.role === 'nurse'){
        this.blocks[2].hide = true
      }
    },

    updateEidtStatus (){
      this.blocks[0].badge = this.infoStatus ? '完成' : '待填写'
      this.blocks[0].badgeClass = this.infoStatus ? 'info-done' : 'info-blank'
      this.blocks[2].badge = this.czsjStatus
    },

    updateShenHeStatus (){
      this.blocks[1].badge = ['未提交', '待审核', '通过', '驳回'][this.shenHeStatus]
      this.blocks[1].badgeClass = [
        'shenhe-nosubmitted',
        'shenhe-ing',
        'shenhe-done',
        'shenhe-rejected'
      ][this.shenHeStatus]
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
  background-color: @theme;
}

/deep/ .weui-grid__icon + .weui-grid__label{
  margin-top: 10px;
}

.assessBadge{
  @size: 1.5em;
  padding: 0;
  width: @size;
  height: @size;
  line-height: @size;
  text-align: center;
  border-radius: 50%;
  top: 0;
  transform: translateY(-50%);
}

// 干掉组件默认边框
/deep/ .weui-grid::after{
  display: none;
}

.hide{
  display: none;
}
</style>
