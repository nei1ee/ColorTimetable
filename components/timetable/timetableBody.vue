<template>
  <view class="timetable-bg" :style="bgImageStyle">
    <!-- 课表时间头 -->
    <view class="timetable-header">
      <view class="timetable-header-left">
        <text>{{ `${currentMonth}\n月` }}</text>
      </view>
      <view class="timetable-header-right">
        <text style="flex: 1;text-align: center;font-size: 24rpx;"
          :class=" (originalWeekIndex === currentWeekIndex) && (thisDay === index + 1) ? 'text-orange text-bold' : '' "
          v-for="(item, index) in dayArray" :key="index">{{ `周${weekTitle[index]}\n${item}` }}</text>
      </view>
    </view>
    <!-- 课表主体区域 -->
    <view class="timetable-body">
      <!-- 课表左侧时间 -->
      <view class="timetable-body-left">
        <view class="timetable-body-left-time" v-for="(item, index) in 10" :key="index">
          <text style="font-size: 20rpx;">
            {{ index + 1 }}
            {{`${classTime[index].s}\n${classTime[index].e}`}}
          </text>
        </view>
      </view>
      <!-- 课表主体区域 -->
      <view class="timetable-body-right">
        <block v-for="(dayTimetable, weekIndex) in 7" :key="weekIndex">
          <block v-for="(dayItem, dayIndex) in 5" :key="dayIndex">
            <course-item :courseItemData="weekTimetable[weekIndex][dayIndex]" :weekIndex="weekIndex"
              :dayIndex="dayIndex"></course-item>
          </block>
        </block>
      </view>
    </view>
  </view>
</template>

<script>
  import {
    courseItem
  } from './courseItem.vue'
  export default {
    name: "timetableBody",
    data() {
      return {
        // 当前月份
        currentMonth: 2,
        weekTitle: ['一', '二', '三', '四', '五', '六', '日'],
        classTime: [{
          's': '08:00',
          'e': '08:50'
        }, {
          's': '08:55',
          'e': '09:45'
        }, {
          's': '10:15',
          'e': '11:05'
        }, {
          's': '11:10',
          'e': '12:00'
        }, {
          's': '14:00',
          'e': '14:50'
        }, {
          's': '14:55',
          'e': '15:45'
        }, {
          's': '16:15',
          'e': '17:05'
        }, {
          's': '17:10',
          'e': '18:00'
        }, {
          's': '19:00',
          'e': '19:50'
        }, {
          's': '19:55',
          'e': '20:45'
        }, {
          's': '20:50',
          'e': '21:40'
        }],
        colorArray: [
          ['#ffc44e', '#ff9192', '#ff9dd6', '#d48cf9', '#aeec35', '#70eb54', '#95e8e9', '#86affe', '#a98fff'],
          ['#87d7eb', '#acd598', '#5ec876', '#fbc7cc', '#ce7cf4', '#bf66d3', '#ffdc72', '#ff9983', '#ff7171']
        ]
      };
    },
    components: {
      courseItem
    },
    props: {
      bgImage: {
        type: String,
        default: ''
      },
      timetableList: {
        type: Array,
        default: []
      },
      startDay: {
        type: String,
        default: '2021-03-01 00:00:00'
      },
      // 默认周
      originalWeekIndex: {
        type: Number,
        default: -1
      },
      currentWeekIndex: {
        type: Number,
        default: -1
      },
      colorArrayIndex: {
        type: Number,
        default: 0
      }
    },
    computed: {
      // 课程背景样式
      bgImageStyle: function() {
        let style = `background-color: #FFFFFF;`
        if (this.bgImage) {
          style = `${style}background-image:url(${this.bgImage});color:#FFFFFF;`
        }
        return style
      },
      // 获取当前天周几
      thisDay: function() {
        return this.$timeUtils.getDay()
      },
      // 本周对应日期
      dayArray: function() {
        const weekIndex = this.currentWeekIndex
        const dayArray = []
        const myDate = new Date(this.startDay)
        myDate.setDate(myDate.getDate() + weekIndex * 7)
        this.currentMonth = myDate.getMonth() + 1
        dayArray.push(this.$timeUtils.formatNumber(myDate.getDate()))
        for (let i = 0; i < 6; i++) {
          myDate.setDate(myDate.getDate() + 1)
          dayArray.push(this.$timeUtils.formatNumber(myDate.getDate()))
        }
        return dayArray
      },
      // 周课表颜色渲染
      weekTimetable: function() {
        const colorArray = this.colorArray[this.colorArrayIndex]
        const colorArrayLength = this.colorArray[this.colorArrayIndex].length
        const colorMap = new Map()
        if (!(this.timetableList.length && this.currentWeekIndex >= 0)) {
          return
        }
        const weekTimetableTemp = this.timetableList[this.currentWeekIndex]
        // 色卡计次
        let colorIndex = 0
        // 循环周
        for (let i = 0; i < 7; i++) {
          // 循环节次
          for (let j = 0; j < 5; j++) {
            // 节次课表
            const timeTimetable = weekTimetableTemp[i][j]
            for (let k = 0; k < timeTimetable.length; k++) {
              // 课表名称
              const title = weekTimetableTemp[i][j][k]['title']
              if (!colorMap.has(title)) {
                colorMap.set(title, colorArray[colorIndex++])
                // 循环色卡
                colorIndex = colorIndex === colorArrayLength ? 0 : colorIndex
              }
              Object.assign(weekTimetableTemp[i][j][k], {
                color: colorMap.get(title)
              })
            }
          }
        }
        return weekTimetableTemp
      }
    }
  }
</script>

<style lang="scss" scoped>
  .bg-orange {
    background-color: #ff907d;
    color: #fff;
  }

  .text-orange {
    color: #ff907d;
  }

  .text-bold {
    font-weight: bold;
  }
  
  .timetable-bg {
    background-size: cover;
    background-position: center center;
    padding-bottom: 120rpx;
  }

  .timetable-header {
    display: flex;
    z-index: 10;
    height: 80rpx;

    &-left {
      background-color: #ff907d;
      color: #fff;
      width: 9vw;
      position: relative;
      text-align: center;
      font-size: 24rpx;
      height: 70rpx;
    }

    &-left::after {
      position: absolute;
      content: '';
      left: 0;
      top: 100%;
      border-style: solid;
      border-width: 0 4.5vw 15rpx 4.5vw;
      border-color: #ff907d #ff907d transparent #ff907d;
    }

    &-right {
      width: 92.6vw;
      line-height: 35rpx;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  .timetable-body {
    display: flex;

    &-left {
      width: 9.0vw;

      &-time {
        height: 120rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
      }
    }

    &-right {
      width: 91.0vw;
      color: #FFFFFF;
      position: relative;
      font-size: 20rpx;
    }
  }
</style>
