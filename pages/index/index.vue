<template>
  <view>
    <view class="" style="display: flex;">
      <button type="default" size="mini"
        @click="showTimetableWeek = !showTimetableWeek">{{showTimetableWeek ? '隐藏周选择' : '显示周选择'}}</button>
      <button type="default" size="mini" @click="colorArrayIndex=0">色卡1</button>
      <button type="default" size="mini" @click="colorArrayIndex=1">色卡2</button>
      <button type="default" size="mini"
        @click="bgImage?bgImage='':bgImage='https://cdn.jsdelivr.net/gh/zguolee/cloud_images/background1.jpeg'">背景</button>
    </view>
    <timetable-week v-if="showTimetableWeek" :timetableList="timetableList" :originalWeekIndex="originalWeekIndex"
      :currentWeekIndex="currentWeekIndex"></timetable-week>
    <timetable-body :bgImage="bgImage" :timetableList="timetableList" :startDay="startDay"
      :originalWeekIndex="originalWeekIndex" :currentWeekIndex="currentWeekIndex" :colorArrayIndex="colorArrayIndex">
    </timetable-body>
  </view>
</template>

<script>
  // 离线数据
  import {
    timetableData
  } from '../../static/guest.js'
  // 周索引切换组件
  import timetableWeek from '../../components/timetable/timetableWeek.vue'
  // 课表主体
  import timetableBody from '../../components/timetable/timetableBody.vue'
  export default {
    data() {
      return {
        // 课表数据
        timetableList: null,
        // 开学时间
        startDay: '2021/03/01 00:00:00',
        // 当前周索引
        originalWeekIndex: 0,
        // 跳转周索引
        currentWeekIndex: 0,
        // 色卡索引
        colorArrayIndex: 0,
        showTimetableWeek: false,
        // 背景图片
        bgImage: ''
      }
    },
    components: {
      timetableWeek,
      timetableBody
    },
    onLoad() {
      this.timetableList = timetableData
      // 获取当前周索引
      this.originalWeekIndex = this.$timeUtils.getCurrentWeekIndex(this.startDay)
      this.currentWeekIndex = this.originalWeekIndex

      // 监听周索引变化
      const that = this
      uni.$on('changeWeekIndex', function(data) {
        that.currentWeekIndex = data.newWeekIndex
        // 设置标题
        uni.setNavigationBarTitle({
          title: `第${that.currentWeekIndex+1}周课表`
        })
      })

      uni.setNavigationBarTitle({
        title: `第${that.currentWeekIndex+1}周课表`
      })
    }
  }
</script>
