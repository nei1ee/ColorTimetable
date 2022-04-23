import { defineStore } from 'pinia'
import { store } from '@/store'
export interface CourseModel {
  // 课程名
  title: string
  // 地点
  location: string
  // 上课时间
  time: string
  // 开始节次
  start: number
  // 持续节次
  duration: number
  // 上课周数
  week: number
  // 上课周次
  weeks: []
  // 教师
  teacher?: string
  // 学分
  credit: number
  // 学时
  period: number
}

export type CourseList = CourseModel[][][][]

const colorMap = new Map<string, string>()

export const colorList = [
  ['#FFDC72', '#CE7CF4', '#FF7171', '#66CC99', '#FF9966', '#66CCCC', '#6699CC', '#99CC99', '#669966', '#66CCFF', '#99CC66', '#FF9999', '#81CC74'],
  ['#99CCFF', '#FFCC99', '#CCCCFF', '#99CCCC', '#A1D699', '#7397db', '#ff9983', '#87D7EB', '#99CC99'],
]

export const courseTimeList = [
  { s: '08:00', e: '08:50' }, { s: '08:55', e: '09:45' },
  { s: '10:15', e: '11:05' }, { s: '11:10', e: '12:00' },
  { s: '14:00', e: '14:50' }, { s: '14:55', e: '15:45' },
  { s: '16:15', e: '17:05' }, { s: '17:10', e: '18:00' },
  { s: '19:00', e: '19:50' }, { s: '19:55', e: '20:45' },
]

export const weekTitle = ['一', '二', '三', '四', '五', '六', '日']

export const useCourseStore = defineStore(
  'course',
  () => {
    const startDate = ref<Date | string>(new Date())
    const semesterCourseList = ref<CourseList>([])
    const currentMonth = ref<number>(0)
    const originalWeekIndex = ref<number>(0)
    const currentWeekIndex = ref<number>(0)
    const colorIndex = ref<number>(0)

    const originalWeeksWeekIndex = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1
    // getters

    function getCurrentWeekDayArray(): number[] {
      const weekIndex = currentWeekIndex.value
      const someDate = new Date(startDate.value)
      someDate.setDate(someDate.getDate() + weekIndex * 7)
      const dayArray: number[] = []
      dayArray.push(someDate.getDate())
      for (let i = 0; i < 6; i++) {
        someDate.setDate(someDate.getDate() + 1)
        dayArray.push(someDate.getDate())
      }
      return dayArray
    }

    const currentWeekDayArray = computed(() => getCurrentWeekDayArray())

    // actions
    /**
     * set start date
     * @param someDate the start date of the semester
     */
    function setStartDay(someDate: string | Date) {
      startDate.value = new Date(someDate)
      // set original week index
      const days = new Date().getTime() - startDate.value.getTime()
      originalWeekIndex.value = Math.floor((days / (1000 * 60 * 60 * 24)) / 7)
      // set current week index
      setCurrentWeekIndex(originalWeekIndex.value)
    }

    function setCurrentWeekIndex(weekIndex: number) {
      currentWeekIndex.value = weekIndex
      // change current month
      const someDate = new Date(startDate.value)
      someDate.setDate(someDate.getDate() + weekIndex * 7)
      currentMonth.value = someDate.getMonth() + 1
    }

    watch(() => colorIndex.value, () => {
      colorMap.clear()
    })

    /**
     * get course item background color
     * @param title course title
     * @returns course color
     */
    function getCourseBgColor(title: string) {
      if (!title)
        return '#FFFFFF'
      if (!colorMap.has(title)) {
        const colorArray = colorList[colorIndex.value]
        let size = colorMap.size
        size = size >= colorArray.length ? 0 : size
        colorMap.set(title, colorArray[size])
      }
      return colorMap.get(title)
    }

    /**
     * set a course item to top when there has two course in the same time
     * @param courseItem course item
     * @param courseItemIndex course item index in one day
     */
    function setCourseItemTop(courseItem: CourseModel, courseItemIndex: number) {
      if (!courseItemIndex)
        return
      const { start, week, weeks } = courseItem
      for (let i = 0; i < weeks.length; i++) {
        const dayDayCourse = semesterCourseList.value[weeks[i] - 1][week - 1][Math.floor(start / 2)]
        if (dayDayCourse.length > 1) {
          const temp = dayDayCourse[courseItemIndex]
          dayDayCourse.splice(courseItemIndex, 1)
          dayDayCourse.unshift(temp)
        }
      }
    }

    /**
     * delete a course item
     * @param courseItem course item
     * @param courseItemIndex course item index in one day
     */
    function handleDeleteCourseItem(courseItem: CourseModel, courseItemIndex: number) {
      const { start, week, weeks } = courseItem
      for (let i = 0; i < weeks.length; i++) {
        semesterCourseList.value[weeks[i] - 1][week - 1][Math.floor(start / 2)]
          .splice(courseItemIndex, 1)
      }
    }

    return {
      startDate,
      currentMonth,
      semesterCourseList,
      originalWeekIndex,
      originalWeeksWeekIndex,
      currentWeekIndex,
      currentWeekDayArray,
      colorIndex,
      setStartDay,
      setCurrentWeekIndex,
      getCourseBgColor,
      setCourseItemTop,
      handleDeleteCourseItem,
    }
  },
)

// Need to be used outside the setup
export function useCourseStoreWidthOut() {
  return useCourseStore(store)
}
