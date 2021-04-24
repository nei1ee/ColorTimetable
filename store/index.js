import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    // 开学时间
    startDay: '',
    // 课表数据
    timetableList: [],
    // 显示周选择组件
    showTimetableWeek: false,
    // 跳转周索引
    targetWeekIndex: -1,
    // 色卡索引
    colorArrayIndex: 0,
    // 背景图片
    bgImage: ''
  },
  mutations: {
    setStartDay(state, startDay) {
      state.startDay = startDay
    },
    setTimetableList(state, timetableList) {
      state.timetableList = timetableList
    },
    changeShowTimetableWeek(state) {
      state.showTimetableWeek = !state.showTimetableWeek
    },
    setCurrentWeekIndex(state, weekIndex) {
      state.targetWeekIndex = weekIndex
    },
    setBgImage(state, bgImage) {
      state.bgImage = bgImage
    }
  },
  getters: {
    originalWeekIndex: (state) => {
      const startDate = new Date(state.startDay)
      const days = new Date().getTime() - startDate.getTime()
      return parseInt((days / (1000 * 60 * 60 * 24)) / 7)
    },
    currentWeekIndex: (state, getters) => {
      if (state.targetWeekIndex === -1) {
        return getters.originalWeekIndex
      }
      return state.targetWeekIndex
    }
  },
  actions: {

  }
})

export default store
