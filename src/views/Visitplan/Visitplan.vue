<template>
  <div class="com-container">
    <vue-header title="出诊计划"></vue-header>
    <table class="schedule">
      <tr>
        <td>时间段</td>
        <td>上午</td>
        <td>下午</td>
        <td>夜间</td>
      </tr>
      <tr v-for="({week, morning, afternoon, night}, index) in table" :key="index">
        <td>{{ xingqi(week) }}</td>
        <td @click="editPlan(index, 0)">{{ morning || '-' }}</td>
        <td @click="editPlan(index, 1)">{{ afternoon || '-' }}</td>
        <td @click="editPlan(index, 2)">{{ night || '-' }}</td>
      </tr>
    </table>
    <div class="com-fillTitle">编辑出诊时间</div>
    <vux-group class="com-group-noMarginTop">
      <cell-input title="日期：　" :value="xingqi(week)"
        :readonly="true"
        :inputStyle="weekValStyle">
      </cell-input>

      <cell-input title="时间段：" :value="timeQ >= 0 ? ['上午', '下午', '夜间'][timeQ] : '未选择'" 
        :readonly="true"
        :inputStyle="timeQValStyle"
      ></cell-input>

      <cell-box @click.native="openStartSelect">
        <span class="cell-title">开始时间：</span>
        <img src="@img/sub/time.png" class="cell-subicon">
        <span class="cell-val" :class="{ unset: start === '' }">{{ start ? start : '请选择开始时间' }}</span>
      </cell-box>

      <cell-box @click.native="openEndSelect">
        <span>结束时间：</span>
        <img src="@img/sub/time.png" class="cell-subicon">
        <span class="cell-val" :class="{ unset: end === '' }">{{ end ? end : '请选择结束时间' }}</span>
      </cell-box>

      <cell-input title="地址：　" :value="address"
        :inputStyle="timeQValStyle"
        @input="val => address = val" 
      ></cell-input>
      <div class="bottom-btns">
        <div class="btn com-theme" @click="save">保存</div>
        <div class="btn" @click="remove">删除</div>
      </div>
    </vux-group>
  </div>
</template>

<script>
import { CellBox } from 'vux'
import CellInput from '@c/cell/CellInput'

function createTable(){
  var table = []
  for(let i=0; i < 7; i++){
    table.push({
      week: i,
      morning: '',
      afternoon: '',
      night: ''
    })
  }
  return table
}

function createSelect(type){
  var select = [],
  begin = 0,
  end = 0
  if(type === 0){
    begin = 8
    end = 12
  }
  if(type === 1){
    begin = 12
    end = 18
  }
  if(type === 2){
    begin = 18
    end = 24
  }

  while(begin <= end){
    var hour = begin < 10 ? ('0' + begin) : begin
    select.push(
      { label: `${hour}:00`, value: `${hour}:00`, },
      { label: `${hour}:15`, value: `${hour}:15`, },
      { label: `${hour}:30`, value: `${hour}:30`, },
      { label: `${hour}:45`, value: `${hour}:45`, },
    )
    begin++
  }

  type === 3 && select.pop()
  return select
}

export default {
  components: {
    CellBox,
    CellInput
  },

  data (){
    return {
      table: createTable(),
      week: -1,   // 星期0~6
      timeQ: -1,   // 时间段0~2
      start: '',
      end: '',
      address: ''
    }
  },

  computed: {
    weekValStyle (){
      return {
        ...(this.week === -1 ? { color: '#ccc' } : {})
      }
    },

    timeQValStyle (){
      return {
        ...(this.timeQ === -1 ? { color: '#ccc' } : {})
      }
    }
  },

  methods: {
    xingqi(index){
      return index >=0 ? '星期' + ['一', '二', '三', '四', '五', '六', '日'][index] : '未选择'
    },

    editPlan (week, timeQ){
      this.start = ''
      this.end = ''
      this.week = week
      this.timeQ = timeQ
    },

    openStartSelect (){
      if(this.week === '' || this.timeQ === ''){
        this.$bus.$emit('vux.toast', '请先选择日期')
        return
      }

      this.$bus.$emit('vux.actionsheet', {
        menus: createSelect(this.timeQ),

        onClick: key => {
          if(this.end){
            var [hour, min] = key.split(':')
            var [e_hour, e_min] = this.end.split(':')
            console.log(hour, min, e_hour, e_min)
            hour = parseInt(hour)
            min = parseInt(min)
            e_hour = parseInt(e_hour)
            e_min = parseInt(e_min)

            var result = true
            if(hour > e_hour){
              result = false
            }else if(hour === e_hour){
              if(min > e_min){
                result = false
              }
            }

            if(!result){
              this.$bus.$emit('vux.toast', '开始时间不能晚于结束时间')
              return
            }

            if(hour === e_hour && min === e_min){
              this.$bus.$emit('vux.toast', '开始时间和结束时间不能相同')
              return
            }
          }

          this.start = key
        }
      })
    },

    openEndSelect (){
      if(this.week === '' || this.timeQ === ''){
        this.$bus.$emit('vux.toast', '请先选择日期')
        return
      }

      this.$bus.$emit('vux.actionsheet', {
        menus: createSelect(this.timeQ),

        onClick: key => {
          if(this.start){
            var [hour, min] = key.split(':')
            var [s_hour, s_min] = this.start.split(':')
            hour = parseInt(hour)
            min = parseInt(min)
            s_hour = parseInt(s_hour)
            s_min = parseInt(s_min)

            var result = true
            if(hour < s_hour){
              result = false
            }else if(hour === s_hour){
              if(min < s_min){
                result = false
              }
            }

            if(!result){
              this.$bus.$emit('vux.toast', '结束时间不能早于开始时间')
              return
            }

            if(hour === s_hour && min === s_min){
              this.$bus.$emit('vux.toast', '开始时间和结束时间不能相同')
              return
            }
          }

          this.end = key
        }
      })
    },

    save (){

    },

    remove (){

    }
  }
}
</script>

<style lang="less" scoped>
.schedule{
  width: 100%;
  background-color: white;
  text-align: center;
  border-collapse: collapse;

  td{
    width: 25%;
    height: 50px;
    border: 1px #b5d6e6 solid;
  }
}

.unset{
  color: #ccc;
}

.cell-subicon{
  width: 20px;
  margin: 0 5px;
  vertical-align: middle;
}

.btn{
  display: inline-block;
  padding: 10px;
  border-radius: 10px;
  color: white;
  margin: 10px;
  font-size: 15px;
}


</style>
