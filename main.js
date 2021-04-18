import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

App.mpType = 'app'
// 引入时间处理工具包
import timeUtils from 'utils/timeUtils.js'

Vue.prototype.$timeUtils = timeUtils

const app = new Vue({
  ...App,
})
app.$mount()
