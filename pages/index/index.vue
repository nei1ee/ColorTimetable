<template>
  <view>
    <view class="" style="display: flex;">
      <button type="default" size="mini" @click="initData">Data</button>
      <button type="default" size="mini"
        @click="$store.commit('changeShowTimetableWeek')">{{showTimetableWeek ? '隐藏周选择' : '显示周选择'}}</button>
      <button type="default" size="mini" @click="colorArrayIndex=0">色卡1</button>
      <button type="default" size="mini" @click="colorArrayIndex=1">色卡2</button>
      <button type="default" size="mini"
        @click="bgImage ? bgImage='':bgImage='https://cdn.jsdelivr.net/gh/zguolee/cloud_images/background1.jpeg'">背景</button>
    </view>
    <timetable></timetable>
  </view>
</template>

<script>
  import {
    mapState
  } from 'vuex'
  import {
    timetableData
  } from '../../static/guest.js'

  import timetable from '../../components/timetable/timetable.vue'
  export default {
    data() {
      return {}
    },
    components: {
      timetable
    },
    onLoad() {
      uni.setNavigationBarTitle({
        title: `第${this.currentWeekIndex+1}周课表`
      })
      this.$store.commit('setStartDay', '2021/03/01 00:00:00')
      // this.$store.commit('setCurrentWeekIndex', this.originalWeekIndex)
      this.$store.commit('setTimetableList', timetableData)
    },
    computed: mapState([
      'originalWeekIndex',
      'currentWeekIndex',
      'showTimetableWeek'
    ])
  }
</script>
