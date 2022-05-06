import { defineStore } from 'pinia'
import { store } from '@/store'

export interface CourseModel {
  title: string
  location: string
  time: string
  start: number
  duration: number
  // [1-7]
  week: number
  // [[1-20]]
  weeks: number[]
  top: boolean
  bgColor?: string
}

export const weekTitle = ['一', '二', '三', '四', '五', '六', '日']

export const courseTimeList = [
  { s: '08:00', e: '08:50' }, { s: '08:55', e: '09:45' },
  { s: '10:15', e: '11:05' }, { s: '11:10', e: '12:00' },
  { s: '14:00', e: '14:50' }, { s: '14:55', e: '15:45' },
  { s: '16:15', e: '17:05' }, { s: '17:10', e: '18:00' },
  { s: '19:00', e: '19:50' }, { s: '19:55', e: '20:45' },
]

const colorMap = new Map<string, string>()

export const colorList = [
  ['#FFDC72', '#CE7CF4', '#FF7171', '#66CC99', '#FF9966', '#66CCCC', '#6699CC', '#99CC99', '#669966', '#66CCFF', '#99CC66', '#FF9999', '#81CC74'],
  ['#99CCFF', '#FFCC99', '#CCCCFF', '#99CCCC', '#A1D699', '#7397db', '#ff9983', '#87D7EB', '#99CC99'],
]

const conflictCourseMap = new Map<CourseModel, CourseModel[]>()

export const useCourseStore = defineStore(
  'course',
  () => {
    const startDate = ref<Date | string>(new Date())
    const semesterCourseList = ref<CourseModel[]>([])
    const currentMonth = ref<number>(0)
    const originalWeekIndex = ref<number>(0)
    const currentWeekIndex = ref<number>(0)
    const colorIndex = ref<number>(0)

    const originalWeeksWeekIndex = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1

    function setSemesterCourseList(courseList: CourseModel[]) {
      colorMap.clear()
      conflictCourseMap.clear()
      for (const courseItem of courseList)
        Object.assign(courseItem, { bgColor: getCourseBgColor(courseItem) })

      semesterCourseList.value = courseList
    }

    // current week course list
    const weekCourseList = computed(() => semesterCourseList.value.filter(item => item.weeks.includes(currentWeekIndex.value + 1)))

    // data for timetable action
    const parsedCourseList = computed(() => {
      // process course list
      const parsedCourseList = Array.from({ length: 20 },
        () => Array.from({ length: 7 },
          () => Array.from({ length: 5 },
            () => 0)))

      for (const courseItem of semesterCourseList.value) {
        const { start, duration, week, weeks } = courseItem
        for (const w of weeks) {
          const dayCourseList = parsedCourseList[w - 1][week - 1]
          dayCourseList[Math.floor(start / 2)]++
          // some courses may last more than 2 times
          if (duration > 2)
            dayCourseList[Math.floor(start / 2 + 1)]++
        }
      }
      return parsedCourseList
    })

    // current week date list
    const currentWeekDayArray = computed(() => {
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
    })

    /**
     * list of course for a certain course item time
     * @param courseItem the course item
     */
    function getConflictCourse(courseItem: CourseModel): CourseModel[] {
      if (!courseItem)
        return []
      const { week, start } = courseItem
      return semesterCourseList.value.filter((item) => {
        return item.weeks.includes(currentWeekIndex.value + 1) && item.week === week && item.start === start
      })
    }

    /**
     * list of course for a certain course item time with map
     * @param courseItem the course item
     */
    function hasConflictCourseMap(courseItem: CourseModel): CourseModel[] {
      if (!conflictCourseMap.has(courseItem))
        conflictCourseMap.set(courseItem, getConflictCourse(courseItem))
      return conflictCourseMap.get(courseItem) || []
    }

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
      conflictCourseMap.clear()
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
     * @param courseItem course item
     * @returns course color
     */
    function getCourseBgColor(courseItem: CourseModel) {
      const { title } = courseItem
      if (!colorMap.has(title)) {
        const colorArray = colorList[colorIndex.value]
        colorMap.set(title, colorArray[colorMap.size % colorArray.length])
      }
      return colorMap.get(title)
    }

    /**
     * set a course to top when there have more than one course in the same time
     * @param courseItem course item
     */
    function setCourseItemTop(courseItem: CourseModel) {
      deleteCourseItem(courseItem)
      semesterCourseList.value.unshift(courseItem)
    }

    /**
     * delete a course
     * @param courseItem course item
     */
    function deleteCourseItem(courseItem: CourseModel) {
      conflictCourseMap.clear()
      const { title, week, start } = courseItem
      for (let i = 0; i < semesterCourseList.value.length; i++) {
        const item = semesterCourseList.value[i]
        if (item.title === title && item.week === week && item.start === start)
          semesterCourseList.value.splice(i, 1)
      }
    }

    return {
      startDate,
      currentMonth,
      semesterCourseList,
      setSemesterCourseList,
      weekCourseList,
      parsedCourseList,
      originalWeekIndex,
      originalWeeksWeekIndex,
      currentWeekIndex,
      currentWeekDayArray,
      colorIndex,
      setStartDay,
      setCurrentWeekIndex,
      getConflictCourse,
      hasConflictCourseMap,
      getCourseBgColor,
      setCourseItemTop,
      deleteCourseItem,
    }
  },
)

// Need to be used outside the setup
export function useCourseStoreWidthOut() {
  return useCourseStore(store)
}
