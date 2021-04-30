<template>
  <view>
    <view class="" style="display: flex;">
      <button type="default" size="mini"
        @click="$store.commit('timetable/changeShowTimetableWeek')">{{showTimetableWeek ? '隐藏周选择' : '显示周选择'}}</button>
      <button type="default" size="mini" @click="$store.commit('timetable/setColorArrayIndex', 0)">色卡1</button>
      <button type="default" size="mini" @click="$store.commit('timetable/setColorArrayIndex', 1)">色卡2</button>
      <button type="default" size="mini"
        @click="bgImage ? $store.commit('timetable/setBgImage', '') : $store.commit('timetable/setBgImage', 'https://cdn.jsdelivr.net/gh/zguolee/cloud_images/background1.jpeg')">背景</button>
    </view>
    <timetable-week></timetable-week>
    <timetable-body></timetable-body>
  </view>
</template>

<script>
  import {
    mapState,
    mapGetters
  } from 'vuex'
  import {
    timetableData
  } from '../../static/guest.js'

  // 周索引切换组件
  import timetableWeek from '../../components/timetable/timetableWeek.vue'
  // 课表主体
  import timetableBody from '../../components/timetable/timetableBody.vue'
  export default {
    data() {
      return {}
    },
    components: {
      timetableWeek,
      timetableBody
    },
    onLoad() {
      uni.setNavigationBarTitle({
        title: `第${this.currentWeekIndex+1}周课表`
      })
      this.$store.commit('timetable/setStartDay', '2021/03/01 00:00:00')
      this.$store.commit('timetable/setTimetableList', timetableData)
    },
    computed: {
      ...mapState('timetable', [
        'showTimetableWeek',
        'bgImage'
      ]),
      ...mapGetters('timetable', [
        'originalWeekIndex',
        'currentWeekIndex',
        'weekWeekIndex'
      ])
    }
  }
</script>
