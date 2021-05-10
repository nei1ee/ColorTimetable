<template>
  <view>
    <!-- 课表主体 -->
    <timetable-body></timetable-body>
    <view class="" style="display: flex;">
      <button type="default" size="mini"
        @click="$store.commit('timetable/changeShowTimetableWeek')">{{showTimetableWeek ? '隐藏周选择' : '显示周选择'}}</button>
      <button type="default" size="mini" @click="$store.commit('timetable/setColorArrayIndex', 0)">色卡1</button>
      <button type="default" size="mini" @click="$store.commit('timetable/setColorArrayIndex', 1)">色卡2</button>
      <button type="default" size="mini"
        @click="bgImage ? $store.commit('timetable/setBgImage', '') : $store.commit('timetable/setBgImage', 'https://cdn.jsdelivr.net/gh/zguolee/cloud_images/background1.jpeg')">背景</button>
    </view>
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
  // 课表主体
  import timetableBody from '../../components/timetable/timetableBody.vue'
  export default {
    data() {
      return {}
    },
    components: {
      timetableBody
    },
    onLoad() {
      const someDate = new Date()
      someDate.setDate(someDate.getDate() - 8 * 7)
      // 设置开学时间 eg: 2021/03/01 00:00:00
      this.$store.commit('timetable/setStartDay', someDate)
      // 初始化课表数据
      this.$store.commit('timetable/setTimetableList', timetableData)
      
      // console.log(JSON.stringify(timetableWeek))
      // 设置背景
      this.$store.commit('timetable/setBgImage', 'https://cdn.jsdelivr.net/gh/zguolee/cloud_images/background1.jpeg')
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
    },
    watch: {
      currentWeekIndex(newVal, oldVal) {
        uni.setNavigationBarTitle({
          title: `第${newVal + 1}周课表`
        })
      }
    }
  }
</script>
