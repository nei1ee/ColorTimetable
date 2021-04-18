class timeUtils {
  // 获取今天距离某天相差天数
  dateMinus(whichDay) {
    let sdate = new Date(whichDay)
    let now = new Date()
    let days = now.getTime() - sdate.getTime()
    let day = parseInt(days / (1000 * 60 * 60 * 24))
    return day
  }
  // 获取当前天距开学日期周索引
  getCurrentWeekIndex(whichDay) {
    return parseInt(this.dateMinus(whichDay) / 7)
  }
  // 获取当前天周几
  getDay() {
    const week = new Date().getDay()
    if (week) return week
    else return 7
  }
  // 日期前加0
  formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  }
}


export default new timeUtils()
