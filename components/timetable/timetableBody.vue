<template>
  <view class="timetable-main text-gray" :style="bgImageStyle">
    <view class="timetable-fixed" :style="bgImageStyle">
      <!-- 周数切换 -->
      <view class="timetable-week" v-if="showTimetableWeek">
        <scroll-view class="week-nav" scroll-x scroll-with-animation :scroll-left="scrollLeft">
          <view class="week-item" v-for="(weekTimetable, weekIndex) in timetableList" :key="weekIndex">
            <view class="item-main" :class="originalWeekIndex === weekIndex ? 'original' : 
              (currentWeekIndex === weekIndex? 'current' : '')"
              @click="$store.commit('timetable/setCurrentWeekIndex', weekIndex)">
              <view class="main-week">
                第{{ weekIndex + 1 }}周
              </view>
              <view class="main-body">
                <block v-for="(dayTimetable, dayIndex) in weekTimetable" :key="dayIndex">
                  <view v-if="dayIndex < 5" class="body-item">
                    <block v-for="(timeTimetable, timeIndex) in dayTimetable" :key="timeIndex">
                      <view class="item-dot" :class="timeTimetable.length >= 1 ? 'true' : 'false'"></view>
                    </block>
                  </view>
                </block>
              </view>
            </view>
          </view>
        </scroll-view>
      </view>
      <!-- 课表时间头 -->
      <view class="timetable-time">
        <view class="timetable-time-left">
          <text>{{ `${currentMonth}\n月` }}</text>
        </view>
        <view class="timetable-time-right">
          <block v-for="(item, index) in currentWeekdDayArray" :key="index">
            <view class="day-item">
              <view v-if="(originalWeekIndex === currentWeekIndex) && (weekWeekIndex === index)" class="day-item-cur">
              </view>
              <text :class="(originalWeekIndex === currentWeekIndex) && (weekWeekIndex === index) ? 'text-orange' : ''">
                {{ `周${weekTitle[index]}\n` }}
                <text style="font-size: 20rpx;">{{`${item?item:'00'}日`}}</text>
              </text>
            </view>
          </block>
        </view>
      </view>
    </view>

    <!-- 课表主体区域 -->
    <view class="timetable-body" :style="showTimetableWeek ? 'margin-top:220rpx;' : 'margin-top:80rpx;'"
      @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd">
      <!-- 课表左侧时间 -->
      <view class="timetable-body-left">
        <view class="timetable-body-left-time" v-for="(item, index) in 10" :key="index">
          <text>
            {{ index + 1 }}\n
            <text style="font-size: 18rpx;">
              {{`${classTime[index].s}\n${classTime[index].e}`}}
            </text>
          </text>
        </view>
      </view>
      <!-- 课表主体 -->
      <view class="timetable-body-right">
        <block v-for="(dayTimetable, weekIndex) in parserTimetable" :key="weekIndex">
          <block v-for="(dayItem, dayIndex) in dayTimetable" :key="dayIndex">
            <view v-if="dayItem.length" class="timetable-item"
              :style="'margin-left:' + (dayItem[0].week - 1) * 13.0 +'vw;margin-top:' +(dayItem[0].start - 1) * 120 + 'rpx;'"
              @click="showCourseDetail(dayItem)">
              <view class="timetable-item-content"
                :style="'height:' + (dayItem[0].duration * 120 - 8) + 'rpx;background-color:' + dayItem[0].color + ';'">
                <view v-if="dayItem.length > 1" class="twice-course"></view>
                <text>
                  <text style="font-size: 24rpx;">
                    {{ parserCourseTitle(dayItem[0].title) }}
                  </text>
                  {{ `\n@${dayItem[0].location}` }}
                </text>
              </view>
            </view>
            <view v-else class="timetable-item blank"
              :style="'margin-left:' + weekIndex * 13.0 + 'vw;margin-top:' + dayIndex * 2 * 120 +'rpx;height: 240rpx;'">
              <view class="timetable-item-content"></view>
            </view>
          </block>
        </block>
      </view>
    </view>
    <!-- 点击课表卡片 -->
    <view class="course-card" v-if="showCourseCard">
      <view class="mask" @click="showCourseCard = !showCourseCard"></view>
      <view class="course-item" v-for="(courseItem, courseItemIndex) in courseCardData" :key="courseItemIndex"
        :style="'background-color:' + courseItem.color">
        <view class="course-title">
          {{ courseItem.title }}
        </view>
        <view class="course-other">
          <view class="">
            <text class="cuIcon-location"></text>{{ courseItem.location ? courseItem.location : '无' }}
          </view>
          <view class="">
            <text class="cuIcon-people"></text>{{ courseItem.teacher ? courseItem.teacher : '无'}}
          </view>
          <view class="">
            <text class="cuIcon-time"></text>{{ courseItem.time ? courseItem.time : '无'}}
          </view>
          <view class="">
            <text class="cuIcon-evaluate"></text>
            {{`学时：${courseItem.period ? courseItem.period : '无'} 学分：${ courseItem.credit ? courseItem.credit : '无'}`}}
          </view>
        </view>
        <view class="course-action">
          <view v-if="courseItemIndex === 0" style="font-size: 32rpx;">已置顶</view>
          <view v-else style="font-size: 32rpx;" @click="setCourseItemTop(courseItem, courseItemIndex)">
            置顶
          </view>
          <view class="cuIcon-write"></view>
          <view class="cuIcon-backdelete" @click="deleteCourseItem(courseItem, courseItemIndex)"></view>
        </view>
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
        weekTitle: ['一', '二', '三', '四', '五', '六', '日'],
        startX: 0,
        towards: 0,
        // 课表详情卡片
        showCourseCard: false,
        courseCardData: null
      };
    },
    computed: {
      ...mapState('timetable', [
        'timetableList',
        'showTimetableWeek',
        'classTime',
        'colorArray',
        'colorArrayIndex',
        'bgImage'
      ]),
      ...mapGetters('timetable', [
        'originalWeekIndex',
        'currentWeekIndex',
        'weekWeekIndex',
        'currentMonth',
        'currentWeekdDayArray'
      ]),
      // 课程背景样式
      bgImageStyle: function() {
        let style = `background-color: #FFFFFF;`
        if (this.bgImage) {
          style = `${style}background-image:url(${this.bgImage});color:#FFFFFF;`
        }
        return style
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
        return weekTimetableTemp
      }
    },
    methods: {
      // 周切换移动动画
      scrollLeft() {
        if (this.showTimetableWeek) {
          if (this.originalWeekIndex === this.currentWeekIndex) {
            return this.originalWeekIndex * 60
          }
          return this.currentWeekIndex * 60
        }
      },
      parserCourseTitle(title) {
        return title.length > 12 ? title.substring(0, 12) : title
      },
      touchStart(e) {
        if (e.touches.length) {
          this.startX = e.touches[0].clientX
        }
      },
      touchMove(e) {
        if (e.touches.length) {
          const moveX = e.touches[0].clientX;
          this.towards = this.startX - moveX;
        }
      },
      touchEnd(e) {
        let currentWeekIndexTemp = this.currentWeekIndex
        const towards = this.towards
        if (towards !== 0) {
          if (towards < -50) {
            // 右滑，周索引--
            if (currentWeekIndexTemp !== 0) {
              currentWeekIndexTemp--
            }
          } else if (towards > 50) {
            // 右滑，周索引++
            if (currentWeekIndexTemp !== 19) {
              currentWeekIndexTemp++
            }
          }
          this.towards = 0
          this.$store.commit('timetable/setCurrentWeekIndex', currentWeekIndexTemp)
        }
      },
      /**
       * 显示课程卡片
       * @param {Object} dayItem 课程数据
       */
      showCourseDetail(dayItem) {
        this.showCourseCard = true
        this.courseCardData = dayItem
      },
      /**
       * 设置置顶
       * @param {Object} courseItem 置顶目标
       * @param {Object} courseItemIndex 需要置顶课程的索引
       */
      setCourseItemTop(courseItem, courseItemIndex) {
        const timetableListTemp = Array.from(this.timetableList)
        const {
          start,
          week,
          weeks
        } = courseItem
        for (let i = 0; i < weeks.length; i++) {
          const dayDayCourse = timetableListTemp[weeks[i] - 1][week - 1][Number.parseInt(start / 2)]
          if (timetableListTemp[weeks[i] - 1][week - 1][Number.parseInt(start / 2)].length > 1) {
            const temp = timetableListTemp[weeks[i] - 1][week - 1][Number.parseInt(start / 2)][courseItemIndex]
            timetableListTemp[weeks[i] - 1][week - 1][Number.parseInt(start / 2)].splice(courseItemIndex, 1)
            timetableListTemp[weeks[i] - 1][week - 1][Number.parseInt(start / 2)].unshift(temp)
          }
        }
        this.$store.commit('timetable/setTimetableList', timetableListTemp)
      },
      /**
       * 删除课程
       * @param {Object} courseItem 删除目标
       * @param {Object} courseItemIndex 需要删除课程的索引
       */
      deleteCourseItem(courseItem, courseItemIndex) {
        const timetableListTemp = Array.from(this.timetableList)
        const {
          start,
          week,
          weeks
        } = courseItem
        uni.showModal({
          title: '警告',
          content: `确定删除该课程吗？\n此操作只会删除星期${ week }的课时`,
          success: (res) => {
            if (res.confirm) {
              for (let i = 0; i < weeks.length; i++) {
                timetableListTemp[weeks[i] - 1][week - 1][Number.parseInt(start / 2)].splice(courseItemIndex, 1)
              }
              this.$store.commit('timetable/setTimetableList', timetableListTemp)
              this.showCourseCard = !this.showCourseCard
            } else {
              return
            }
          }
        })
      },
    }
  }
</script>

<style lang="scss" scoped>
  @import 'icon.css';

  .bg-orange {
    background-color: #ff907d;
    color: #fff;
  }

  .text-orange {
    color: #ff907d;
  }

  .text-blue {
    color: #1798D9;
  }

  .text-gray {
    color: #666666;
  }

  .text-bold {
    font-weight: bold;
  }

  .timetable-main {
    background-size: cover;
    background-position: center center;
    padding-bottom: 20rpx;

    .timetable-fixed {
      position: fixed;
      top: 0;
      z-index: 100;
      width: 100%;
    }
  }

  .timetable-week {
    background-color: #F1F1F1;
    color: #666666;
    height: 140rpx;
    display: flex;
    align-items: center;

    .week-nav {
      white-space: nowrap;

      .week-item {
        width: 132rpx;
        height: 120rpx;
        display: inline-block;

        .item-main {
          width: 96rpx;
          border-radius: 10rpx;
          margin: 0 auto;
          padding: 8rpx 0;
          display: flex;
          justify-content: center;
          flex-direction: column;
          align-items: center;

          &.original {
            background-color: #C8C7CC;
          }

          &.current {
            background-color: #FFFFFF;
          }

          .main-week {
            font-size: 20rpx;
            text-align: center;
            margin-bottom: 8rpx;
          }

          .main-body {
            width: 70rpx;
            height: 70rpx;
            display: flex;
            justify-content: space-evenly;

            .body-item {
              width: 10rpx;
              height: 70rpx;
              display: flex;
              flex-direction: column;
              justify-content: space-evenly;

              .item-dot {
                width: 10rpx;
                height: 10rpx;
                border-radius: 50%;

                &.true {
                  background-color: #3fd0a9;
                }

                &.false {
                  background-color: #DCDCDC;
                }
              }
            }
          }
        }
      }
    }
  }


  .timetable-time {
    display: flex;
    height: 80rpx;
    font-size: 25rpx;

    &-left {
      width: 9.0vw;
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
    }

    &-right {
      width: 91.0vw;
      display: flex;

      .day-item {
        border-radius: 10rpx;
        text-align: center;
        font-size: 24rpx;
        width: calc(13.0vw - 8rpx);
        margin: 4rpx;
        position: relative;
        display: flex;
        justify-content: center;

        &-cur {
          width: calc(13.0vw - 40rpx);
          height: 8rpx;
          background-color: #FF907D;
          position: absolute;
          bottom: -2rpx;
          border-radius: 5rpx;
        }
      }
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
        font-size: 20rpx;
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
    z-index: 10;

    &-content {
      margin: 4rpx;
      border-radius: 10rpx;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;

      .twice-course {
        width: 70rpx;
        height: 8rpx;
        margin: 0 auto;
        background-color: #FFFFFF;
        position: absolute;
        bottom: 10rpx;
        border-radius: 5rpx;
        opacity: 0.7;
      }
    }
  }

  .blank {
    z-index: 5;
  }

  .course-card {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 100;
    display: flex;
    justify-content: center;
    flex-direction: column;

    .mask {
      position: absolute;
      width: 100%;
      height: 120%;
      top: 0;
      left: 0;
      z-index: 105;
      background: rgba(0, 0, 0, 0.4);
    }

    .course-item {
      margin: 30rpx 40rpx;
      padding: 30rpx;
      border-radius: 20rpx;
      background-color: #FFFFFF;
      z-index: 200;
      color: #FFFFFF;
      line-height: 1.6em;

      .course-title {
        padding: 20rpx 0;
        text-align: center;
        font-size: 36rpx;
      }

      .course-other {
        padding: 10rpx 20rpx;

        text {
          font-size: 36rpx;
          margin-right: 10rpx;
        }
      }

      .course-action {
        padding: 10rpx 20rpx;
        font-size: 42rpx;
        display: flex;
        align-items: center;

        view {
          margin-right: 50rpx;
        }
      }
    }
  }
</style>
