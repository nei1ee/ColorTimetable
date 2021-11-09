<template>
  <view class="timetable-main text-gray" :style="[bgImageStyle]">
    <view class="timetable-fixed" :style="[bgImageStyle, { 'padding-top': customBar + 'px' }]">
      <!-- 周数切换 -->
      <view class="timetable-week" v-if="showTimetableWeek">
        <scroll-view class="week-nav" scroll-x scroll-with-animation :scroll-left="scrollLeft">
          <view
            class="week-item"
            v-for="(weekTimetable, weekIndex) in timetableList"
            :key="weekIndex"
          >
            <view
              class="item-main"
              :class="
                originalWeekIndex === weekIndex
                  ? 'original'
                  : currentWeekIndex === weekIndex
                  ? 'current'
                  : ''
              "
              @click="$store.commit('timetable/setCurrentWeekIndex', weekIndex)"
            >
              <view class="main-week">第{{ weekIndex + 1 }}周</view>
              <view class="main-body">
                <block v-for="(dayTimetable, dayIndex) in weekTimetable" :key="dayIndex">
                  <view v-if="dayIndex < 5" class="body-item">
                    <block v-for="(timeTimetable, timeIndex) in dayTimetable" :key="timeIndex">
                      <view
                        class="item-dot"
                        :class="timeTimetable.length >= 1 ? 'true' : 'false'"
                      ></view>
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
              <text
                :class="
                  originalWeekIndex === currentWeekIndex && weekWeekIndex === index
                    ? 'cur'
                    : ''
                "
              >
                {{ `周${weekTitle[index]}\n` }}
                <text style="font-size: 20rpx;">{{ `${item ? item : '00'}日` }}</text>
              </text>
            </view>
          </block>
        </view>
      </view>
    </view>

    <!-- 课表主体区域 -->
    <view
      class="timetable-body"
      :style="{ 'padding-top': `calc(${customBar}px + ${showTimetableWeek ? '220' : '80'}rpx)` }"
      @touchstart="touchStart"
      @touchmove="touchMove"
      @touchend="touchEnd"
    >
      <!-- 课表左侧时间 -->
      <view class="timetable-body-left">
        <view class="timetable-body-left-time" v-for="(item, index) in 10" :key="index">
          <text>
            {{ index + 1 }}\n
            <text style="font-size: 18rpx;">
              {{ `${classTime[index].s}\n${classTime[index].e}` }}
            </text>
          </text>
        </view>
      </view>
      <!-- 课表主体 -->
      <view class="timetable-body-right">
        <block
          v-for="(dayTimetable, weekIndex) in timetableList[currentWeekIndex]"
          :key="weekIndex"
        >
          <block v-for="(dayItem, dayIndex) in dayTimetable" :key="dayIndex">
            <view
              class="timetable-item"
              :class="!dayItem.length ? 'blank' : ''"
              :style="
                'margin-left:' + weekIndex * 13.0 + 'vw;margin-top:' + dayIndex * 2 * 120 + 'rpx;'
              "
              @click="showCourseDetail(dayItem)"
            >
              <view
                v-if="dayItem.length"
                class="timetable-item-content"
                :style="
                  'height:' +
                    (dayItem[0].duration * 120 - 8) +
                    'rpx;background-color:' +
                    getCourseColor(dayItem[0].title) +
                    ';'
                "
              >
                <view v-if="dayItem.length > 1" class="twice-course"></view>
                <text>
                  <text style="font-size: 24rpx;">{{ parserCourseTitle(dayItem[0].title) }}</text>
                  {{ `\n@${dayItem[0].location}` }}
                </text>
              </view>
            </view>
          </block>
        </block>
      </view>
    </view>
    <!-- 课表卡片 -->
    <view class="course-card" v-if="showCourseCard">
      <view class="mask" @click="showCourseCard = !showCourseCard"></view>
      <view
        class="course-item"
        v-for="(courseItem, courseItemIndex) in courseCardData"
        :key="courseItemIndex"
        :style="'background-color:' + getCourseColor(courseItem.title)"
      >
        <view class="course-title">{{ courseItem.title }}</view>
        <view class="course-other">
          <view class="course-other-item">
            <text class="cIcon-location">
              {{ courseItem.location ? courseItem.location : '无' }}
            </text>
          </view>
          <view class="course-other-item">
            <text class="cIcon-people">{{ courseItem.teacher ? courseItem.teacher : '无' }}</text>
          </view>
          <view class="course-other-item">
            <text class="cIcon-time">{{ courseItem.time ? courseItem.time : '无' }}</text>
          </view>
          <view class="course-other-item">
            <text class="cIcon-evaluate" style="margin-right: 20rpx;">
              {{ `学时：${courseItem.period ? courseItem.period : '无'}` }}
            </text>
            <text class="cIcon-favor">
              {{ `学分：${courseItem.credit ? courseItem.credit : '无'}` }}
            </text>
          </view>
        </view>
        <view class="course-action">
          <view class="title" v-if="courseItemIndex === 0">已置顶</view>
          <view class="title" v-else @click="setCourseItemTop(courseItem, courseItemIndex)">
            置顶
          </view>
          <view class="cuIcon-write"></view>
          <view
            class="cuIcon-backdelete"
            @click="deleteCourseItem(courseItem, courseItemIndex)"
          ></view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
export default {
  name: 'timetableBody',
  data() {
    return {
      customBar: this.customBar,
      statusBar: this.statusBar,
      weekTitle: ['一', '二', '三', '四', '五', '六', '日'],
      colorMap: new Map(),
      startX: 0,
      towards: 0,
      // 课表详情卡片
      showCourseCard: false,
      courseCardData: null,
    };
  },
  computed: {
    ...mapState('timetable', [
      'timetableList',
      'showTimetableWeek',
      'classTime',
      'colorArray',
      'colorArrayIndex',
      'bgImage',
    ]),
    ...mapGetters('timetable', [
      'originalWeekIndex',
      'currentWeekIndex',
      'weekWeekIndex',
      'currentMonth',
      'currentWeekdDayArray',
    ]),
    // 课程背景样式
    bgImageStyle: function() {
      const style = {
        'background-color': '#FFFFFF',
      };
      if (this.bgImage) {
        Object.assign(style, {
          color: '#FFFFFF',
          'background-image': `url(${this.bgImage})`,
        });
      }
      return style;
    },
    // 周切换移动动画
    scrollLeft() {
      if (this.showTimetableWeek) {
        if (this.originalWeekIndex === this.currentWeekIndex) {
          return this.originalWeekIndex * 60;
        }
        return this.currentWeekIndex * 60;
      }
    },
  },
  watch: {
    timetableList(newVal, oldVal) {
      // 清除课程颜色缓存
      this.colorMap.clear();
    },
    colorArrayIndex(newVal, oldVal) {
      // 清除课程颜色缓存
      this.colorMap.clear();
    },
  },
  methods: {
    parserCourseTitle(title) {
      return title.length > 12 ? title.substring(0, 12) : title;
    },
    /**
     * 获取课程颜色
     * @param {Object} title 课程名
     */
    getCourseColor(title) {
      if (!this.colorMap.has(title)) {
        const colorArray = this.colorArray[this.colorArrayIndex];
        let size = this.colorMap.size;
        size = size >= colorArray.length ? 0 : size;
        this.colorMap.set(title, colorArray[size]);
      }
      return this.colorMap.get(title);
    },
    // 按住
    touchStart(e) {
      if (e.touches.length) {
        this.startX = e.touches[0].clientX;
      }
    },
    // 移动
    touchMove(e) {
      if (e.touches.length) {
        const moveX = e.touches[0].clientX;
        this.towards = this.startX - moveX;
      }
    },
    // 停止
    touchEnd(e) {
      let currentWeekIndexTemp = this.currentWeekIndex;
      const towards = this.towards;
      if (towards !== 0) {
        if (towards < -100) {
          // 右滑，周索引--
          if (currentWeekIndexTemp !== 0) {
            currentWeekIndexTemp--;
          }
        } else if (towards > 100) {
          // 右滑，周索引++
          if (currentWeekIndexTemp !== 19) {
            currentWeekIndexTemp++;
          }
        }
        this.towards = 0;
        this.$store.commit('timetable/setCurrentWeekIndex', currentWeekIndexTemp);
      }
    },
    /**
     * 显示/添加课程
     * @param {Object} dayItem 课程数据
     */
    showCourseDetail(dayItem) {
      if (dayItem.length) {
        this.showCourseCard = true;
        this.courseCardData = dayItem;
      } else {
        console.log('add');
      }
    },
    /**
     * 设置置顶
     * @param {Object} courseItem 置顶目标
     * @param {Object} courseItemIndex 需要置顶课程的索引
     */
    setCourseItemTop(courseItem, courseItemIndex) {
      const timetableListTemp = Array.from(this.timetableList);
      const { start, week, weeks } = courseItem;
      for (let i = 0; i < weeks.length; i++) {
        const dayDayCourse = timetableListTemp[weeks[i] - 1][week - 1][Number.parseInt(start / 2)];
        if (dayDayCourse.length > 1) {
          const temp = dayDayCourse[courseItemIndex];
          dayDayCourse.splice(courseItemIndex, 1);
          dayDayCourse.unshift(temp);
        }
      }
      this.$store.commit('timetable/setTimetableList', timetableListTemp);
      uni.setStorageSync('timetable', timetableListTemp);
    },
    /**
     * 删除课程
     * @param {Object} courseItem 删除目标
     * @param {Object} courseItemIndex 需要删除课程的索引
     */
    deleteCourseItem(courseItem, courseItemIndex) {
      const timetableListTemp = Array.from(this.timetableList);
      const { start, week, weeks } = courseItem;
      uni.showModal({
        title: '警告',
        content: `确定删除该课程吗？\n此操作只会删除星期${week}的课时`,
        success: (res) => {
          if (res.confirm) {
            for (let i = 0; i < weeks.length; i++) {
              timetableListTemp[weeks[i] - 1][week - 1][Number.parseInt(start / 2)].splice(
                courseItemIndex,
                1
              );
            }
            this.$store.commit('timetable/setTimetableList', timetableListTemp);
            uni.setStorageSync('timetable', timetableListTemp);
            this.showCourseCard = !this.showCourseCard;
          } else {
            return;
          }
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.bg-orange {
  background-color: #ff907d;
  color: #fff;
}

.text-orange {
  color: #ff907d;
}

.text-blue {
  color: #1798d9;
}

.text-gray {
  color: #666666;
}

.text-bold {
  font-weight: bold;
}

.timetable-main {
  background-size: cover;
  background-position: top center;

  .timetable-fixed {
    position: fixed;
    z-index: 100;
    width: 100%;
    top: 0;
    background-size: cover;
    background-position: top center;
  }
}

.timetable-week {
  background-color: #f1f1f1;
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
          background-color: #c8c7cc;
        }

        &.current {
          background-color: #ffffff;
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
                background-color: #dcdcdc;
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
    width: 9vw;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }

  &-right {
    width: 91vw;
    display: flex;

    .day-item {
      text-align: center;
      font-size: 24rpx;
      width: calc(13vw - 8rpx);
      margin: 4rpx;
      position: relative;
      display: flex;
      justify-content: center;
    }
    .cur {
      width: 80%;
      color: #ff907d;
      border-bottom: 8rpx solid #ff907d;
    }
  }
}

.timetable-body {
  display: flex;

  &-left {
    width: 9vw;

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
    width: 91vw;
    color: #ffffff;
    position: relative;
    font-size: 20rpx;
  }
}

.timetable-item {
  position: absolute;
  width: 13vw;
  z-index: 10;
  // opacity: 0.8;

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
      background-color: #ffffff;
      position: absolute;
      bottom: 10rpx;
      border-radius: 5rpx;
      opacity: 0.7;
    }
  }
}

.blank {
  height: 240rpx;
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
    animation: card 0.2s ease-in;
    z-index: 200;
    color: #ffffff;
    line-height: 1.6em;

    .course-title {
      padding: 20rpx 0;
      text-align: center;
      font-size: 36rpx;
    }

    .course-other {
      padding: 10rpx 20rpx;

      &-item {
        font-size: 32rpx;
      }
    }

    .course-action {
      width: 50%;
      padding: 10rpx 20rpx;
      font-size: 42rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .title {
        font-size: 32rpx;
      }
    }
  }

  @keyframes card {
    0% {
      transform: rotateY(-90deg);
    }

    100% {
      transform: rotateY(0);
    }
  }
}
</style>
