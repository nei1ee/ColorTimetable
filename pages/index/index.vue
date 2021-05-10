<template>
  <view>
    <view class="custom-bar" :style="{height:customBar + 'px'}">
      <view class="action" :style="style">
        <view class="left">
          <text :class="drawerModal ? 'cuIcon-back':'cuIcon-settingsfill'"></text>
          <view name="backText">{{ drawerModal ? '隐藏' : '更多' }}</view>
        </view>
        <view class="center">
          <view @click="$store.commit('timetable/changeShowTimetableWeek')">
            第{{ currentWeekIndex + 1 }}周{{currentWeekIndex !== originalWeekIndex?'(非本周)':''}}
            <text :class="showTimetableWeek ? 'cuIcon-fold' : 'cuIcon-unfold'"></text>
          </view>
        </view>
        <view class="right"></view>
      </view>
    </view>
    <!-- 课表主体 -->
    <timetable-body></timetable-body>
    <view class="" style="display: flex;">
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
      return {
        customBar: this.customBar,
        statusBar: this.statusBar
      }
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
      style() {
        var StatusBar = this.statusBar;
        var CustomBar = this.customBar;
        var bgImage = this.bgImage;
        var style = `height:${CustomBar - StatusBar}px;padding-top:${StatusBar}px;`;
        if (this.bgImage) {
          style = `${style}background-image:url(${bgImage});`;
        }
        return style
      },
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

<style lang="scss" scoped>
  .custom-bar {
    width: 100%;
    position: fixed;
    top: 0;
    z-index: 9999;
    color: #FFFFFF;

    .action {
      background-size: cover;
      background-position: 0% 0%;
      display: flex;
      justify-content: space-around;
      align-items: center;

      .left {
        margin-left: 20rpx;
        justify-content: flex-start;
      }

      .center {
        flex: 2;
        font-size: 32rpx;
      }
    }

    .action>view {
      flex: 1;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
</style>
