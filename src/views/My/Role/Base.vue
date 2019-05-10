<template>
  <div class="com-container">
    <vue-header :title="_role + '资格认证'"></vue-header>
    <vux-group class="com-group-noMarginTop">
      <user-info-item title="医院" type="btn" :value="_yi_yuan" @click.native="open_Yi_yuan_Select"></user-info-item>
      <user-info-item title="科室" type="btn" :value="_ke_shi" @click.native="open_Ke_shi_Select"></user-info-item>
      <user-info-item title="职称" type="btn" :value="_zhi_cheng" @click.native="open_Zhi_cheng_Select"></user-info-item>
      <vux-cell title="选择教学疾病" :is-link="true" @click.native="to_Jiao_xue_ji_bing_Select">
        <span class="com-cell-text jxjb_Hint">{{ _jiao_xue_ji_bing }}</span>
      </vux-cell>
      <slot></slot>
    </vux-group>
    <vux-group>
      <x-textarea v-model="zi_wo_jie_shao" :height="200" title="个人简介" :max="140"
      placeholder="请输入个人介绍，字数在140字以内..."></x-textarea>
    </vux-group>
    <pic-upload :title="_role + '资格证书'" :subtitle="`请上传完整${_role}证书详情页`" id="1"
      @ready="img => zi_ge_zheng_shu = img"
    ></pic-upload>
    <pic-upload :title="_role + '执业证书'" :subtitle="`请上传带有执业地点详情页的图片`" id="2"
      @ready="img => zhi_ye_zheng_shu = img"
    ></pic-upload>
    <div class="mainBtn-container">
      <x-button text="上传认证" @click.native="submit" :disabled="disabled"></x-button>
    </div>
  </div>
</template>

<script>
import { XTextarea , XButton } from 'vux'
import UserInfoItem from '@c/cell/UserInfoItem'
import picUpload from '@c/block/picUpload'

export default {
  props: {
    role: {},
    visible_Jiao_xue_ji_bing: {
      default: true
    }
  },

  components: {
    XTextarea, XButton,
    UserInfoItem, picUpload
  },

  data (){
    return {
      ke_shi_Data: {},    // 用于存储各医院科室数据(按id存储)，实现有数据取数据，没有再请求接口
      zhi_cheng_Data: {}, // 这个直接拿原始数据渲染列表，不用关心顺序,
      jiao_xue_ji_bing_Data: [],

      yi_yuan: '',
      ke_shi: '',
      zhi_cheng: '',
      jiao_xue_ji_bing: [],
      zi_wo_jie_shao: '',
      zi_ge_zheng_shu: null,
      zhi_ye_zheng_shu: null,
      disabled: false
    }
  },

  mounted (){
    this.$store.dispatch('constText/get', `${this.role}_title_val`)
    .then(data => this.zhi_cheng_Data = data)
  },

  computed: {
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

    _yi_yuan (){
      var index = -1
      this.yi_yuan_Data.some((val, ind) =>{
        if(val.id === this.yi_yuan){
          index = ind
          return true
        }
      })
      return index >= 0 ? this.yi_yuan_Data[index].name : ''
    },

    _ke_shi (){
      if(this.ke_shi_Data[this.yi_yuan]){
        var index = -1
        this.ke_shi_Data[this.yi_yuan].some((val, ind) =>{
          if(val.id === this.ke_shi){
            index = ind
            return true
          }
        })

        return index >= 0 ? this.ke_shi_Data[this.yi_yuan][index].name : ''
      }else{
        return ''
      }
    },

    _zhi_cheng (){
      return this.zhi_cheng_Data[this.zhi_cheng] || ''
    },

    _jiao_xue_ji_bing (){
      return this.jiao_xue_ji_bing ? this.jiao_xue_ji_bing.map(val => val.name).join('、') : ''
    }
  },

  watch: {
    // 选择医院后开始加载对应科室集
    yi_yuan (val){
      var req = () =>{
        return _request({
          url: 'apply/departmentBaseList',
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

    $route (route){
      if(route.params.selected){
        this.jiao_xue_ji_bing = route.params.selected
      }
    }
  },

  methods: {
    open_Yi_yuan_Select (){
      if(!this.yi_yuan_Data){
        this.$bus.$emit('vux.toast', '加载列表失败，请重试')
        this.$store.dispatch('hospList/load')
        return
      }

      var menus = this.yi_yuan_Data.map(val =>{
        return {
          label: val.name,
          value: val.id
        }
      })

      this.$bus.$emit('vux.actionsheet', {
        menus,
        onClick: key => this.yi_yuan = key
      })
    },

    open_Ke_shi_Select (){
      if(this.yi_yuan === ''){
        this.$bus.$emit('vux.toast', '请先选择医院')
        return
      }
      var data = this.ke_shi_Data[this.yi_yuan]

      if(!data){
        this.$bus.$emit('vux.toast', '加载列表失败，请重试')
        return
      }

      var menus = data.map(val =>{
        return {
          label: val.name,
          value: val.id
        }
      })

      this.$bus.$emit('vux.actionsheet', {
        menus,
        onClick: key => this.ke_shi = key
      })
    },

    open_Zhi_cheng_Select (){
      this.$bus.$emit('vux.actionsheet', {
        menus: this.zhi_cheng_Data,
        onClick: key => this.zhi_cheng = key
      })
    },

    to_Jiao_xue_ji_bing_Select (){
      if(this.yi_yuan === '' || this.ke_shi === ''){
        this.$bus.$emit('vux.toast', '请先选择医院和科室')
        return
      }

      this.$toView('my/role/sub/jxjb', {
        params: {
          options: this.jiao_xue_ji_bing_Data,
          selected: this.jiao_xue_ji_bing,
          back: this.$route.name,
        }
      })

      // var menus = this.jiao_xue_ji_bing_Data.map(val =>{
      //   return {
      //     label: val.name,
      //     value: val.id
      //   }
      // })
      // this.$bus.$emit('vux.actionsheet', {
      //   menus,
      //   onClick: key => this.jiao_xue_ji_bing = key
      // })
    },

    submit (){
      var {yi_yuan, ke_shi, zhi_cheng, zi_wo_jie_shao, zi_ge_zheng_shu, zhi_ye_zheng_shu } = this
      if(
        !(yi_yuan && ke_shi && zhi_cheng && zi_wo_jie_shao && zi_ge_zheng_shu && zhi_ye_zheng_shu)
        && (this.visible_Jiao_xue_ji_bing ? this.jiao_xue_ji_bing : true )
      ){
        this.$bus.$emit('vux.toast', '请确认是否有未填项')
        return
      }

      var data = {
        hospital: yi_yuan,
        title: this._zhi_cheng,
        department_id: ke_shi,
        desc: zi_wo_jie_shao,
        zgzj_img: zi_ge_zheng_shu,
        zyzj_img: zhi_ye_zheng_shu,          
      }

      if(this.visible_Jiao_xue_ji_bing){
        data.ill_ids = this.jiao_xue_ji_bing.map(val => val.id).join('&')
      }

      this.$emit('ready', data)
      
      // _request({
      //   url: 'apply/doctorApplyPost',
      //   method: 'post',
      //   data: {
      //     hospital: yi_yuan,
      //     title: this._zhi_cheng,
      //     department_id: ke_shi,
      //     desc: zi_wo_jie_shao,
      //     zgzj_img: zi_ge_zheng_shu,
      //     zyzj_img: zhi_ye_zheng_shu,          
      //   }
      // }).then(({data}) =>{
      //   this.disabled = false
      //   if(data.result){
      //     this.$bus.$emit('vux.alert', '上传成功')
      //   }else{
      //     this.$bus.$emit('vux.toast', data.message)
      //   }
      // }).catch(e =>{
      //   this.disabled = false
      //   console.log(e)
      //   this.$bus.$emit('vux.toast', {
      //     type: 'cancel',
      //     text: '网络错误'
      //   })
      // })
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
  width: 7em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
