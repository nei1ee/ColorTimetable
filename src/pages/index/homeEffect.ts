export const useCourseTimeEffect = () => {
  const courseTimeList = [
    { s: '08:00', e: '08:50' }, { s: '08:55', e: '09:45' },
    { s: '10:15', e: '11:05' }, { s: '11:10', e: '12:00' },
    { s: '14:00', e: '14:50' }, { s: '14:55', e: '15:45' },
    { s: '16:15', e: '17:05' }, { s: '17:10', e: '18:00' },
    { s: '19:00', e: '19:50' }, { s: '19:55', e: '20:45' },
  ]
  const weekTitle = ['一', '二', '三', '四', '五', '六', '日']
  return { courseTimeList, weekTitle }
}

export const useCourseStyleEffect = () => {
  const colorList = [
    ['#FFDC72', '#CE7CF4', '#FF7171', '#66CC99', '#FF9966', '#66CCCC', '#6699CC', '#99CC99', '#669966', '#66CCFF', '#99CC66', '#FF9999', '#81CC74'],
    ['#99CCFF', '#FFCC99', '#CCCCFF', '#99CCCC', '#A1D699', '#7397db', '#ff9983', '#87D7EB', '#99CC99'],
  ]
  const colorMap = new Map()

  /**
   * get course item background color
   * @param title course title
   * @returns course color
   */
  const getCourseBackgroundColor = (title: string) => {
    if (!title) return '#FFFFFF'
    if (!colorMap.has(title)) {
      const colorArray = colorList[0]
      let size = colorMap.size
      size = size >= colorArray.length ? 0 : size
      colorMap.set(title, colorArray[size])
    }
    return colorMap.get(title)
  }

  /**
   * get course item position
   * @param item course item
   * @returns css style
   */
  const getCourseRowColumnStart2End = (item: any): object => {
    const rowStart = item.start
    const rowEnd = rowStart + item.duration
    const columnStart = item.week + 1
    const columnEnd = columnStart + 1
    return {
      'grid-row': `${rowStart} / ${rowEnd}`,
      'grid-column': `${columnStart} / ${columnEnd}`,
    }
  }

  return {
    getCourseBackgroundColor,
    getCourseRowColumnStart2End,
  }
}
