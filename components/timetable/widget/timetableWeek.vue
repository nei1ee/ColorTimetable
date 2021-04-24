<template>
  <view style="background-color: #F1F1F1;">
    <scroll-view class="week-choose-nav" scroll-x scroll-with-animation :scroll-left="scrollLeft">
      <block v-for="(weekTimetable, weekIndex) in timetableList" :key="weekIndex">
        <view class="week-item"
          :class="originalWeekIndex === weekIndex ? 'original' : (currentWeekIndex === weekIndex? 'current' : '')"
          @click="changeWeekIndex(weekIndex)">
          <view class="week-item-week">
            第{{ weekIndex + 1 }}周
          </view>
          <view class="week-item-all">
            <view v-for="(dayTimetable, dayIndex) in weekTimetable" :key="dayIndex">
              <block v-for="(timeTimetable, timeIndex) in dayTimetable" :key="timeIndex">
                <view style="padding: 2rpx;" v-if="dayIndex < 5">
                  <view class="item-dot" :class="timeTimetable.length >= 1 ? 'true' : 'false'"></view>
                </view>
              </block>
            </view>
          </view>
        </view>
      </block>
    </scroll-view>
  </view>
</template>

<script>
  import {
    mapState
  } from 'vuex'
  export default {
    data() {
      return {}
    },
    computed: {
      ...mapState([
        'startDay',
        'timetableList',
        'originalWeekIndex',
        'currentWeekIndex',
        'colorArrayIndex',
        'bgImage'
      ]),
      // 周切换移动动画
      scrollLeft() {
        if (this.originalWeekIndex === this.currentWeekIndex) {
          return this.originalWeekIndex * 60
        }
        return this.currentWeekIndex * 60
      }
    },
    methods: {
      changeWeekIndex: function(weekIndex) {
        // 触发周索引变化
        uni.$emit('changeWeekIndex', {
          newWeekIndex: weekIndex
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .week-choose-nav {
    white-space: nowrap;

    .week-item {
      margin: 10rpx;
      padding: 16rpx 0;
      border-radius: 10rpx;
      display: inline-block;

      &.original {
        background-color: #C8C7CC;
      }

      &.current {
        background-color: #FFFFFF;
      }

      &-week {
        font-size: 24rpx;
        text-align: center;
        margin-bottom: 4rpx;
      }

      &-all {
        display: flex;
        width: 80rpx;
        margin: 0 20rpx;
        justify-content: center;
      }
    }
  }

  .item-dot {
    width: 12rpx;
    height: 12rpx;
    border-radius: 50%;

    &.true {
      background-color: #3fd0a9;
    }

    &.false {
      background-color: #DCDCDC;
    }
  }
</style>
