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
        <td @click="editPlan(index, 0)">
          <span v-if="!morning.start">-</span>
          <div v-else>
            <div class="timeQ">{{ morning.start }} - {{ morning.end }}</div>
            <div class="address">{{ morning.address }}</div>
          </div>
        </td>
        <td @click="editPlan(index, 1)">
          <span v-if="!afternoon.start">-</span>
          <div v-else>
            <div class="timeQ">{{ afternoon.start }} - {{ afternoon.end }}</div>
            <div class="address">{{ afternoon.address }}</div>
          </div>
        </td>
        <td @click="editPlan(index, 2)">
          <span v-if="!night.start">-</span>
          <div v-else>
            <div class="timeQ">{{ night.start }} - {{ night.end }}</div>
            <div class="address">{{ night.address }}</div>
          </div>
        </td>
      </tr>
    </table>
    <div class="com-fillTitle">编辑出诊时间</div>
    <vux-group class="com-group-noMarginTop" ref="editor">
      <cell-input title="日期：　" :value="xingqi(week)"
        :readonly="true"
        :inputStyle="weekValStyle">
      </cell-input>

      <cell-input title="时间段：" :value="timeQ >= 0 ? ['上午', '下午', '夜间'][timeQ] : '点击上方表格进行选择'" 
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

      <cell-input title="地址：　" :value="address" placeholder="请在此输入出诊地址"
        :inputStyle="timeQValStyle"
        @input="val => address = val" 
      ></cell-input>
      <div class="bottom-btns">
        <div class="btn color-theme-bg" :class="{ disabled }" @click="save">保存</div>
        <div class="btn color-danger-bg" :class="{ disabled }" @click="remove" v-if="this.id">删除</div>
      </div>
    </vux-group>
  </div>
</template>

<script>
import { CellBox } from 'vux'
import CellInput from '@c/cell/CellInput'
import localStorage from '@u/localStorage'

// 初始化表格数据
function createTable(){
  var table = []
  function planInfo(){
    return {
      start: '',
      end: '',
      address: '',
      id: ''
    }
  }

  for(let i=0; i < 7; i++){
    table.push({
      week: i,
      morning: planInfo(),
      afternoon: planInfo(),
      night: planInfo()
    })
  }

  return table
}

// 生成时间选项列表
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
      start: '',   // 开始时间
      end: '',     // 结束时间
      address: '',
      id: '',
      disabled: false
    }
  },

  mounted (){
    // 读取已有数据
    _request({
      url: 'czsj/index'
    }).then(({data}) =>{
      if(data.result){
        data.ret.forEach((line, lineInd) =>{
          if(line === null){ return }
          line.forEach((block, blockInd) =>{
            if(block === null){ return }
            var { 
              id, 
              day: week, 
              shijianduan: timeQ,
              time_from: start,
              time_to: end,
              address
            } = block

            var timeQStr = ['morning', 'afternoon', 'night'][timeQ]
            start = start.replace(/:00$/, '')
            end = end.replace(/:00$/, '')
            this.table[week][timeQStr] = { id, start, end, address }
          })
        })
      }
    })
  },

  computed: {
    // 控制日期颜色，没有时改为灰色
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
    // 返回汉字星期
    xingqi(index){
      return index >=0 ? '星期' + ['一', '二', '三', '四', '五', '六', '日'][index] : '点击上方表格进行选择'
    },

    // 点击表格单元时，初始化下方列表
    editPlan (week, timeQ){
      var timeQStr = ['morning', 'afternoon', 'night'][timeQ]

      var plan = this.table[week][timeQStr]
      this.start = plan.start
      this.end = plan.end
      this.week = week
      this.timeQ = timeQ
      this.address = plan.address
      this.id = plan.id

      this.$refs.editor.$el.scrollIntoView()
    },

    // 开启开始时间选择列表
    openStartSelect (){
      if(this.week === -1 || this.timeQ === -1){
        this.$bus.$emit('vux.toast', '请先选择日期')
        return
      }

      this.$bus.$emit('vux.actionsheet', {
        menus: createSelect(this.timeQ),

        onClick: key => {
          if(this.end){
            var [hour, min] = key.split(':')
            var [e_hour, e_min] = this.end.split(':')
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

    // 开启结束时间列表
    openEndSelect (){
      if(this.week === -1 || this.timeQ === -1){
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

    // 保存
    save (){
      if(this.week === -1 || this.timeQ === -1 || this.address === ''){
        this.$bus.$emit('vux.toast', '请确认是否有未填项')
        return
      }

      this.disabled = true
      _request({
        url: 'czsj/edit',
        method: 'post',
        data: {
          shijianduan: this.timeQ,
          day: this.week + 1,
          time_from: this.start,
          time_to: this.end,
          address: this.address
        }
      }).then(({data}) =>{
        this.disabled = false
        if(data.result){
          var timeQ = ['morning', 'afternoon', 'night'][this.timeQ]
          this.table[this.week][timeQ] = {
            start: this.start,
            end: this.end,
            address: this.address,
            id: data.ret.id
          }

          this.id = data.ret.id
          this.$bus.$emit('vux.toast', {
            type: 'success',
            text: '保存成功'
          })
        }else{
          this.$bus.$emit('vux.toast', data.message)
        }
      }).catch(e =>{
        console.log(e)
        this.disabled = false
        this.$bus.$emit('vux,toast', {
          type: 'cancel',
          text: '网络错误'
        })
      })
    },

    // 删除
    remove (){
      this.disabled = true
      _request({
        url: 'czsj/del',
        method: 'post',
        data: {
          id: this.id
        }
      }).then(({data}) =>{
        this.disabled = false
        if(data.result){
          this.$bus.$emit('vux.toast', {
            type: 'success',
            text: '删除成功'
          })

          var timeQ = ['morning', 'afternoon', 'night'][this.timeQ]
          this.table[this.week][timeQ] = {
            start: '',
            end: '',
            address: '',
            id: ''
          }

          this.start = ''
          this.end = ''
          this.address = ''
          this.id = ''
        }else{
          this.$bus.$emit('vux.toast', data.message)
        }
      }).catch(e =>{
          this.disabled = false
          this.$bus.$emit('vux,toast', {
          type: 'cancel',
          text: '网络错误'
        })
      })
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
  table-layout: fixed;

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

.bottom-btns{
  width: 100%;
  display: flex;
  justify-content: space-around;
}

.btn{
  display: inline-block;
  padding: 10px 30px;
  border-radius: 25px;
  color: white;
  margin: 10px;
  font-size: 15px;
}

/deep/ input::-webkit-input-placeholder{
  color: #ccc;
}

.weui-cell::before{
  border-color: #ccc;
  left: 0;
}

.address{
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
