import { colorList, useCourseStore } from '@/store/modules/course'
const courseStore = useCourseStore()

export const useCourseStyleEffect = () => {
  const colorMap = new Map<string, string>()

  watch(() => courseStore.colorIndex, () => {
    colorMap.clear()
  })

  /**
   * get course item background color
   * @param title course title
   * @returns course color
   */
  const getCourseBackgroundColor = (title: string) => {
    if (!title)
      return '#FFFFFF'
    if (!colorMap.has(title)) {
      const colorArray = colorList[courseStore.colorIndex]
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
