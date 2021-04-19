<template>
  <block>
    <view class="timetable-item" v-if="courseItemData.length >= 1"
      :style="'margin-left:' + (courseItemData[0].week - 1) * 13.0 +'vw;margin-top:' +(courseItemData[0].start - 1) * 120 + 'rpx;height:' + courseItemData[0].duration * 120 + 'rpx;'">
      <view class="timetable-item-content"
        :style="courseItemData.length > 1? 'height:' + (courseItemData[0].duration * 120 - 6) + 'rpx;background: linear-gradient(to left top, transparent 50%, rgba(0, 0, 0, 0.2) 0) no-repeat 100% 100% / 1.0em 1.0em, linear-gradient(-45deg, transparent 0.7em,' + courseItemData[0].color + ' 0);' : 'height:' + (courseItemData[0].duration * 120 - 6) + 'rpx;background-color:' +courseItemData[0].color + ';'"
        @click="showModal(weekIndex, dayIndex, courseItemData)">
        <text>
          <text style="font-size: 24rpx;">
            {{ parserCourseTitle(courseItemData[0].title) }}
          </text>
          {{ `\n@${courseItemData[0].location}` }}
        </text>
      </view>
    </view>
    <view class="timetable-item" v-else style="z-index: 4;"
      :style="'margin-left:' + weekIndex * 13.0 + 'vw;margin-top:' + dayIndex * 2 * 120 +'rpx;height: 240rpx;'">
      <view class="timetable-item-content" @click="showModal(weekIndex,dayIndex)"></view>
    </view>
  </block>
</template>

<script>
  export default {
    data() {
      return {}
    },
    props: {
      // 节次索引课表数据
      courseItemData: {
        type: Array,
        default: {}
      },
      // 周几索引
      weekIndex: {
        type: Number,
        default: 1
      },
      // 节次索引
      dayIndex: {
        type: Number,
        default: 1
      }
    },
    methods: {
      parserCourseTitle: function(title) {
        return title.length > 12 ? title.substring(0, 12) : title
      },
      /**
       * 点击课程
       * @param {Number} weekIndex 周几索引
       * @param {Number} dayIndex 节次索引
       * @param {Object} courseItemData 当前点击课程列表
       */
      showModal: function(weekIndex, dayIndex, courseItemData = []) {
        console.log(weekIndex, dayIndex)
        let str = courseItemData.length ? '' : '暂无课程'
        for (let i = 0; i < courseItemData.length; i++) {
          str += `课程名${i+1}：${courseItemData[i].title}\n`
          str += `地点${i+1}：${courseItemData[i].location}\n`
        }
        const dayTimetable = JSON.stringify(courseItemData)
        uni.showModal({
          title: '课表',
          content: str
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
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
