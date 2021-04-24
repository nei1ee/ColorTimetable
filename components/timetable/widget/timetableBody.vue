<template>
  <view class="timetable-bg" :style="bgImageStyle">
    <!-- 课表时间头 -->
    <view class="timetable-header" :style="!bgImage ? 'background-color:#FFFFFF' : ''">
      <view class="timetable-header-left">
        <text>{{ `${currentMonth}\n月` }}</text>
      </view>
      <view class="timetable-header-right">
        <block v-for="(item, index) in dayArray" :key="index">
          <text style="flex: 1;text-align: center;font-size: 24rpx;"
            :class="(originalWeekIndex === currentWeekIndex) && (weekWeekIndex === index) ? 'text-orange text-bold' : '' ">
            {{ `周${weekTitle[index]}\n${item}` }}
          </text>
        </block>
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
            <view class="timetable-item" v-if="parserTimetable[weekIndex][dayIndex].length"
              :style="'margin-left:' + (parserTimetable[weekIndex][dayIndex][0].week - 1) * 13.0 +'vw;margin-top:' +(parserTimetable[weekIndex][dayIndex][0].start - 1) * 120 + 'rpx;height:' + parserTimetable[weekIndex][dayIndex][0].duration * 120 + 'rpx;'">
              <view class="timetable-item-content"
                :style="parserTimetable[weekIndex][dayIndex].length > 1? 'height:' + (parserTimetable[weekIndex][dayIndex][0].duration * 120 - 6) + 'rpx;background: linear-gradient(to left top, transparent 50%, rgba(0, 0, 0, 0.2) 0) no-repeat 100% 100% / 1.0em 1.0em, linear-gradient(-45deg, transparent 0.7em,' + parserTimetable[weekIndex][dayIndex][0].color + ' 0);' : 'height:' + (parserTimetable[weekIndex][dayIndex][0].duration * 120 - 6) + 'rpx;background-color:' + parserTimetable[weekIndex][dayIndex][0].color + ';'">
                <text>
                  <text style="font-size: 24rpx;">
                    {{ parserCourseTitle(parserTimetable[weekIndex][dayIndex][0].title) }}
                  </text>
                  {{ `\n@${parserTimetable[weekIndex][dayIndex][0].location}` }}
                </text>
              </view>
            </view>
            <view class="timetable-item" v-else style="z-index: 4;"
              :style="'margin-left:' + weekIndex * 13.0 + 'vw;margin-top:' + dayIndex * 2 * 120 +'rpx;height: 240rpx;'">
              <view class="timetable-item-content"></view>
            </view>
          </block>
        </block>
      </view>
    </view>
  </view>
</template>

<script>
  import {
    mapState,
    mapGetters
  } from 'vuex'
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
    computed: {
      ...mapState([
        'startDay',
        'timetableList',
        'colorArrayIndex',
        'bgImage'
      ]),
      ...mapGetters([
        'originalWeekIndex',
        'currentWeekIndex'
      ]),
      // 课程背景样式
      bgImageStyle: function() {
        let style = `background-color: #FFFFFF;`
        if (this.bgImage) {
          style = `${style}background-image:url(${this.bgImage});color:#FFFFFF;`
        }
        return style
      },
      // 获取当前天周几
      weekWeekIndex: function() {
        return this.$timeUtils.getWeekWeekIndex()
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
      parserTimetable: function() {
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
        console.log(weekTimetableTemp)
        return weekTimetableTemp
      }
    },
    methods: {
      parserCourseTitle: function(title) {
        if (title) {
          return title.length > 12 ? title.substring(0, 12) : title
        }
        return '空'
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
      border-width: 0 4.55vw 16rpx 4.55vw;
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

  .timetable-item {
    position: absolute;
    width: 13.0vw;
    padding: 3.0rpx;
    z-index: 5;
    display: flex;
    align-items: center;
    justify-content: center;

    &-content {
      width: calc(13.0vw - 6rpx);
      height: 100%;
      border-radius: 10rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
    }
  }
</style>
