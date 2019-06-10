<!--
  认证页面的基本模板，点击上传按钮且数据全部达到条件后触发ready事件，提供一个参数返回标准格式的api请求主体
-->
<template>
  <div class="com-container">
    <vue-header :title="_role + '资格认证'"></vue-header>
    <view-box>
      <vux-group class="com-group-noMarginTop">
        <vux-selector v-model="yi_yuan" title="医院" placeholder="未选择"
          :options="yi_yuan_Data.map(val => ({ key: val.id, value: val.name }))"
        ></vux-selector>
        <vux-selector v-model="ke_shi" title="科室" placeholder="未选择"
          :options="ke_shi_Data[this.yi_yuan] ? ke_shi_Data[this.yi_yuan].map(val => ({ key: val.id, value: val.name })) : []"
        ></vux-selector>
        <vux-selector v-model="zhi_cheng" title="职称" placeholder="未选择"
          :options="zhi_cheng_DataOfSelector"
        ></vux-selector>
        
        <vux-cell title="选择教学疾病" :is-link="true"
          @click.native="to_Jiao_xue_ji_bing_Select"
          v-if="visible_Jiao_xue_ji_bing"
        >
          <span class="com-cell-text jxjb_Hint">{{ _jiao_xue_ji_bing }}</span>
        </vux-cell>
        <slot></slot>
      </vux-group>
      <vux-group>
        <x-textarea v-model="zi_wo_jie_shao" :height="200" title="个人简介" :max="140"
        placeholder="请输入个人介绍，字数在140字以内..."></x-textarea>
      </vux-group>
      <pic-upload :title="_role + '资格证书'" :subtitle="`请上传完整${_role}证书详情页`"
        @ready="img => zi_ge_zheng_shu = img"
        :show="zi_ge_zheng_shu_Img"
      ></pic-upload>

      <pic-upload :title="_role + '执业证书'" :subtitle="`请上传带有执业地点详情页的图片`"
        @ready="img => zhi_ye_zheng_shu = img"
        :show="zhi_ye_zheng_shu_Img"
      ></pic-upload>

      <pic-upload :title="_role + '职称证书'" :subtitle="`请上传职称证书的图片`"
        @ready="img => zhi_cheng_zheng_shu = img"
        :show="zhi_cheng_zheng_shu_Img"
      ></pic-upload>

      <div class="mainBtn-container">
        <x-button text="上传认证" @click.native="submit" :disabled="disabled"></x-button>
      </div>
    </view-box>
  </div>
</template>

<script>
import { XTextarea , XButton, Selector } from 'vux'
import UserInfoItem from '@c/cell/UserInfoItem'
import picUpload from '@c/block/picUpload'

import upload from '@u/request/upload'

export default {
  props: {
    role: {},
    visible_Jiao_xue_ji_bing: {
      default: true
    }
  },

  components: { 
    XTextarea, XButton, VuxSelector: Selector,
    UserInfoItem, picUpload
  },

  data (){
    return {
      ke_shi_Data: {},    // 用于存储各医院科室数据(按id存储)，实现有数据取数据，没有再请求接口
      zhi_cheng_Data: {}, // 这个直接拿原始数据渲染列表，不用关心顺序,
      jiao_xue_ji_bing_Data: [],

      // 以下3个保存的都是对应id
      yi_yuan: '',
      ke_shi: '',
      zhi_cheng: '',
      jiao_xue_ji_bing: [],   // 已经选择的疾病组
      zi_wo_jie_shao: '',     // 介绍内容，非id
      zi_ge_zheng_shu: null,  // 这三个保存img图片文件
      zhi_ye_zheng_shu: null,
      zhi_cheng_zheng_shu: null,
      zi_ge_zheng_shu_Img: '',   // 保存获取到的已有图片url
      zhi_ye_zheng_shu_Img: '',  // 保存获取到的已有图片url
      zhi_cheng_zheng_shu_Img: '',  // 保存获取到的已有图片url
      disabled: false
    }
  },

  mounted (){
    // 初始化对应职称数据
    this.$store.dispatch('constText/get', `${this.role}_title_val`)
    .then(data => this.zhi_cheng_Data = data)

    // 读取已有的认证信息
    _request({
      url: `apply/${this.role}Apply`
    }).then(({data}) =>{
      if(data.result){
        var {ret} = data
        this.yi_yuan = ret.hospital_cache ? ret.hospital_cache : ''
        this.ke_shi = ret.department_id_cache ? ret.department_id_cache : ''
        this.zhi_cheng = ret.title_cache ? ret.title_cache : ''
        this.jiao_xue_ji_bing = ret.ill_ids_cache ? ret.ill_ids_cache.toString().split('&') : []
        this.zi_wo_jie_shao = ret.desc_cache ? ret.desc_cache.toString() : ''
        this.zhi_ye_zheng_shu_Img = ret.zyzj_img
        this.zhi_ye_zheng_shu = ret.zyzj_img
        this.zi_ge_zheng_shu_Img = ret.zgzj_img
        this.zi_ge_zheng_shu = ret.zgzj_img
        this.zi_cheng_zheng_shu_Img = ret.zczj_img
        this.zi_cheng_zheng_shu = ret.zczj_img
      }
    })
  },

  computed: {
    // 从store获取医院的简单表格{ id(医院id), name(医院名) }
    yi_yuan_Data (){
      return this.$store.getters['hospList/plain']
    },

    // 有前下划线的都是用于显示的值，将id映射为对应字符串
    _role (){
      return {
        nurse: '护士',
        doctor: '医师'
      }[this.role]
    },

    zhi_cheng_DataOfSelector (){
      return Object.keys(this.zhi_cheng_Data).map(val => ({
        key: val,
        value: this.zhi_cheng_Data[val]
      }))
    },

    _zhi_cheng (){
      return this.zhi_cheng_Data[this.zhi_cheng] || ''
    },

    _jiao_xue_ji_bing (){
      return this.jiao_xue_ji_bing ? 
        this.jiao_xue_ji_bing_Data.filter(val => {
          // 强制全部转换为字符串格式，因为源数据有字符串格式，有数字格式
          this.jiao_xue_ji_bing = this.jiao_xue_ji_bing.map(val => val.toString())
          return this.jiao_xue_ji_bing.includes(val.id.toString())
        }).map(val => val.name).join('、')
      : ''
    }
  },

  watch: {
    // 选择医院后开始加载对应科室集
    yi_yuan (val){
      var req = () =>{
        return _request({
          url: 'apply/departmentList',
          params: {
            hospital_id: val
          }
        }).then(({data}) =>{
          if(data.result){
            Vue.set(this.ke_shi_Data, val, data.ret.map(val =>{
              var {name, id} = val
              return { name, id }
            }))
          }
        })
      }
      
      // 出错后再试一次
      req().catch(e =>{
        console.log(e)
        req()
      })
    },

    // 选择科室后加载对应教学疾病集
    ke_shi (){
      var req = () =>{
        return _request({
          url: 'apply/departmentIllList',
          params: {
            department_id: this.ke_shi
          }
        }).then(({data}) =>{
          if(data.result){
            this.jiao_xue_ji_bing_Data = data.ret.map(val =>{
              var { name, id } = val.ill
              return { name, id }
            })
          }
        })
      }

      // 出错后再试一次
      req().catch(e =>{
        console.log(e)
        req()
      })
    },

    // 监视从教学疾病选择页返回时携带的已选项集
    $route (route){
      if(route.params.selected){
        this.jiao_xue_ji_bing = route.params.selected
      }
    }
  },

  methods: {
    // 打开职称选择列表
    open_Zhi_cheng_Select (){
      this.$bus.$emit('vux.actionsheet', {
        menus: this.zhi_cheng_Data,
        onClick: key => this.zhi_cheng = key
      })
    },

    // 跳转至教学疾病选择页面
    to_Jiao_xue_ji_bing_Select (){
      if(this.yi_yuan === null || this.ke_shi === null){
        this.$bus.$emit('vux.toast', '请先选择医院和科室')
        return
      }

      this.$toView('my/role/sub/jxjb', {
        // 这里提供选项列表和已经选择的项，通过选择页面上的“确定按钮”再返回选中的项
        params: {
          options: this.jiao_xue_ji_bing_Data,
          selected: this.jiao_xue_ji_bing,
          back: this.$route.name,
        }
      })
    },

    // 点击了提交按钮
    submit (){
      // 检测是否有空项
      var {yi_yuan, ke_shi, zhi_cheng, zi_wo_jie_shao, zi_ge_zheng_shu, zhi_ye_zheng_shu,  
        zhi_cheng_zheng_shu
      } = this
      if(
        !(yi_yuan && ke_shi && zhi_cheng && zi_wo_jie_shao && zi_ge_zheng_shu && zhi_ye_zheng_shu
          && zhi_cheng_zheng_shu
        ) && (this.visible_Jiao_xue_ji_bing ? this.jiao_xue_ji_bing : true )
      ){
        this.$bus.$emit('vux.toast', '请确认是否有未填项')
        return
      }

      var data = {
        hospital: yi_yuan,
        title: zhi_cheng,
        department_id: ke_shi,
        ill_ids: this.jiao_xue_ji_bing.join('&'),
        desc: zi_wo_jie_shao,
        zgzj_img: zi_ge_zheng_shu,
        zyzj_img: zhi_ye_zheng_shu,       
        zczj_img: zhi_cheng_zheng_shu   
      }

      // 为护士认证时将教学疾病全选
      if(this.role === 'nurse'){
        data.ill_ids = this.jiao_xue_ji_bing_Data.map(val => val.id).join('&')
      }

      this.disabled = true
      // 如果图片为文件格式（说明新上传了图片），则执行上传
      var foo = () =>{
        return new Promise(async (resolve, reject) =>{
          if(typeof data.zgzj_img !== 'string'){
            await upload(data.zgzj_img)
            .then(res =>{
              data.zgzj_img = Vue._GLOBAL.qiniuPic + res.key
            }).catch(e =>{
              console.log(e)
              reject()
            })
          }
          if(typeof data.zyzj_img !== 'string'){
            await upload(data.zyzj_img)
            .then(res =>{
              data.zyzj_img = Vue._GLOBAL.qiniuPic + res.key
            }).catch(e =>{
              console.log(e)
              reject()
            })
          }
          if(typeof data.zczj_img !== 'string'){
            await upload(data.zczj_img)
            .then(res =>{
              data.zczj_img = Vue._GLOBAL.qiniuPic + res.key
            }).catch(e =>{
              console.log(e)
              reject()
            })
          }
          resolve()
        })
      }

      foo().then(() =>{
        return _request({
          url: `apply/${this.role}ApplyPost`,
          method: 'post',
          data
        }).then(({data}) =>{
          this.disabled = false
          if(data.result){
            this.$bus.$emit('vux.alert', '上传成功')
            this.$store.dispatch('user/get')
            this.$toView('home')
          }else{
            this.$bus.$emit('vux.toast', data.message)
          }
        })
      }).catch(e =>{
        this.disabled = false
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
.mainBtn-container{
  margin: 20px 0;
  padding: 0 10px;
}

.jxjb_Hint{
  width: 8em;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
