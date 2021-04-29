import Vue from 'vue'
import Vuex from 'vuex'

import timetable from '@/store/modules/timetable'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    timetable
  }
})

export default store
