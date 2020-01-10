<template>
  <div>
    <vux-cell :title="title"  @click.native="isCollapse = !isCollapse">
    <!-- :is-link="true" -->
    <!-- :arrow-direction="isCollapse ? 'down' : 'up'" -->
    <slot>
        <span style="margin-left:5px;display:inline-block;font-size:10px;" @click.stop="$emit('addCourse', catalogid)"><span class="iconfont icon-zengjia" style="display:block;text-align:center"></span>增加课程</span>
        <span style="margin-left:5px;display:inline-block;font-size:10px;" @click.stop="$emit('editCourse', catalogid)"><span class="iconfont icon-bianji" style="display:block;text-align:center"></span>编辑</span>
        <span style="margin-left:5px;display:inline-block;font-size:10px;" @click.stop="$emit('moveDown', catalogid)"><span class="iconfont icon-jiantouxia" style="display:block;text-align:center"></span>下移</span>
        <span style="margin-left:5px;display:inline-block;font-size:10px;" @click.stop="$emit('moveUp', catalogid)"><span class="iconfont icon-jiantoushang" style="display:block;text-align:center"></span>上移</span>
       <span style="margin-left:5px;display:inline-block;font-size:10px;" @click.stop="$emit('removeCourse', catalogid)"><span class="iconfont icon-shanchu-tianchong" style="display:block;text-align:center"></span>删除</span>
    </slot>
    </vux-cell>
     <ul v-if="!isCollapse" class="list">
      <li v-for="(course, index) in courses || []" :key="index">
        {{ course.title}}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: [
    'title', 'files','courses','catalogid'
  ],

  data (){
    return {
      isCollapse: true
    }
  },

  methods: {
      addCourse(){
          console.log(item)
      },
      editCourse(){

      },
      moveDown(){

      },
      moveUp(){

      },
      remove(){

      }
      
      
  }
}
</script>

<style lang="less" scoped>
.list{
  color: #666;
  padding-left: 45px;
  list-style: none;
  
  > li{
    line-height: 30px;
    padding-right: 5px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
}
</style>
