<template>
  <view>
    <timetable-week></timetable-week>
    <timetable-body></timetable-body>
    <!-- <view class="course-detail" v-if="showCourseDetail">
      <view class="mask" @click="showCourseDetail = !showCourseDetail"></view>
      <swiper class="card-swiper">
        <swiper-item class="card-swiper-item" v-for="(courseItem, courseIndex) in courseDetailData.courseItemData"
          :key="courseIndex">
          <view class="swiper-item">
            <view class="swiper-body">
              <view class="course-title">
                {{ courseItem.title }}
              </view>
              <view class="course-other">
                <view class="">
                  地点：{{ courseItem.location ? courseItem.location : '无' }}
                </view>
                <view class="">
                  教师：{{ courseItem.teacher ? courseItem.teacher : '无'}}
                </view>
                <view class="">
                  时间：{{ courseItem.time ? courseItem.time : '无'}}
                </view>
              </view>
            </view>
          </view>
        </swiper-item>
      </swiper>
    </view> -->
  </view>
</template>

<script>
  import {
    mapState,
    mapGetters
  } from 'vuex'
  // 周索引切换组件
  import timetableWeek from './widget/timetableWeek.vue'
  // 课表主体
  import timetableBody from './widget/timetableBody.vue'
  export default {
    name: "timetable",
    data() {
      return {
        showCourseDetail: false,
        courseDetailData: null
      }
    },
    components: {
      timetableWeek,
      timetableBody
    },
    created() {
      // this.$store.commit('setCurrentWeekIndex', this.originalWeekIndex)
      // const that = this
      // 监听课表详情
      // uni.$on('showDetailCourse', function(data) {
      //   console.log('showDetailCourse')
      //   that.showCourseDetail = true
      //   that.courseDetailData = data
      //   // that.currentWeekIndex = data.newWeekIndex
      //   console.log(data)
      // })
      // console.log(this.startDay)
      // console.log(this.timetableList)
    },
    computed: {
      ...mapState('timetable', [
        'timetableList',
        'showTimetableWeek',
        'colorArrayIndex'
      ]),
      ...mapGetters('timetable', [
        'originalWeekIndex',
        'currentWeekIndex'
      ])
    }
  }
</script>

<style lang="scss" scoped>
  .week-back {
    position: absolute;
    bottom: 38.2vh;
    right: 38.2vw;
    z-index: 100;
  }

  .course-detail {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 100;

    .mask {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      background: rgba(0, 0, 0, 0.6);
    }

    .card-swiper {
      margin-top: 16.1vh;
      height: 800rpx !important;

      .card-swiper-item {
        width: 610rpx !important;
        left: 70rpx;
        box-sizing: border-box;
        overflow: initial;
      }

      .swiper-item {
        background-color: #FFFFFF;
        width: 100%;
        display: block;
        height: 100%;
        border-radius: 20rpx;
        transform: scale(0.9);
        transition: all 0.2s ease-in 0s;
        overflow: hidden;

        .swiper-body {
          padding: 60rpx 30rpx;

          .course-title {
            text-align: center;
            font-size: 36rpx;
          }

          .course-other {
            padding: 30rpx;
            line-height: 1.6em;
          }
        }
      }

      .cur .swiper-item {
        transform: none;
        transition: all 0.2s ease-in 0s;
      }
    }
  }
</style>
