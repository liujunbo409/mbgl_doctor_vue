<!-- 上传图片组件 -->
<template>
  <label :for="'picUpload' + id">
    <main>
      <header>
        <p class="title">{{ title }}</p>
        <p class="subtitle">{{ subtitle }}</p>
      </header>
      <input type="file" accept=".png, .jpg, .jpeg" :id="'picUpload' + id" style="position:fixed; left: -9999px;"
        @change="ready"
      >
      <div class="pic">
        <img :src="uri || show || require('@img/btn/upload.png')">
      </div>
    </main>
  </label>
</template>

<script>
export default {
  props: [
    'title', 'subtitle', 'id', 'show'
  ],

  data (){
    return {
      uri: ''
    }
  },

  methods: {
    ready (e){
      var img = e.target.files[0]
      this.uri = URL.createObjectURL(img)
      this.$emit('ready', img)
    }
  }
}
</script>

<style lang="less" scoped>
main{
  min-height: 250px;
  background-color: white;
  margin-top: 20px;
  box-sizing: border-box;
  padding: 10px 15px;

  header{
    height: 50px;

    .title{
      font-size: 17px;
    }
    .subtitle{
      color: #ccc;
    }
  }

  .pic{
    height: 200px;
    box-sizing: border-box;
    text-align: center;
    padding: 10px;

    > img{
      width: 170px;
      position: relative;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
</style>
