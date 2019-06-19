<template>
  <div class="container">
    <header>
      <img src="@img/sub/doctor_icon.png" class="icon">
      <div class="info">
        <p class="realName">{{ data.role_name + role }}</p>
        <div class="zhi_cheng">{{ data.role_title_str }}</div>
      </div>
    </header>

    <main>
      {{ data.content.toString().replace(/([\s\S]{100})[\s\S]+/, '$1') }}
      <span class="color-theme" v-if="data.content.length > 100">&nbsp;……全文</span>
    </main>

    <footer>
      <span>{{ data.approved_num }}人赞同</span>
      <span>{{ data.like_num }}人感谢</span>
      <span>{{ data.comment_num }}个评论</span>
      <span>{{ data.updated_at | date }}</span>
    </footer>
  </div>
</template>

<script>
export default {
  props: ['data'],

  data (){
    return {

    }
  },

  computed: {
    role (){
      return {
        doctor: '医生',
        nurse: '护士'
      }[this.data.role]
    },
  },

  methods: {

  }
}
</script>

<style lang="less" scoped>
.container{
  background-color: white;
  margin-bottom: 10px;
  padding: 10px;

  header{
    width: 100%;
    display: flex;

    .icon{
      width: 40px;
      border-radius: 50%;
      margin-right: 10px;
    }

    .zhi_cheng{
      color: #aaa;
    }
  }

  main{
    margin: 10px;
  }

  footer{
    width: 100%;
    display: flex;
    justify-content: space-around;
  }
}
</style>
