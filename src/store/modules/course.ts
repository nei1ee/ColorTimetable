import { defineStore } from 'pinia'
import { store } from '@/store'

export interface CourseModel {
  title: string
  location: string
  start: number
  duration: number
  // [1-7]
  week: number
  // [[1-20]]
  weeks: number[]
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

export const colorArrayList = [
  ['#FFDC72', '#CE7CF4', '#FF7171', '#66CC99', '#FF9966', '#66CCCC', '#6699CC', '#99CC99', '#669966', '#66CCFF', '#99CC66', '#FF9999', '#81CC74'],
  ['#99CCFF', '#FFCC99', '#CCCCFF', '#99CCCC', '#A1D699', '#7397db', '#ff9983', '#87D7EB', '#99CC99'],
]

const conflictCourseMap = new Map<CourseModel, CourseModel[]>()

export const useCourseStore = defineStore(
  'course',
  () => {
    const startDate = ref<Date | string>(new Date())
    const weekNum = ref<number>(20)
    const courseList = ref<CourseModel[]>([])
    const currentMonth = ref<number>(0)
    const originalWeekIndex = ref<number>(0)
    const currentWeekIndex = ref<number>(0)
    const originalWeekWeekIndex = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1
    const colorArrayIndex = ref<number>(0)

    /**
     * init course list
     * @param newCourseList new course list
     */
    function setCourseList(newCourseList: CourseModel[]) {
      conflictCourseMap.clear()
      courseList.value = newCourseList
      resetCourseBgColor()
    }

    // current week course list
    const weekCourseList = computed(
      () => courseList.value && courseList.value.filter(item => item.weeks.includes(currentWeekIndex.value + 1)),
    )

    // data for course action
    const parsedCourseList = computed(() => {
      // init a course array
      const parsedCourseList = Array.from({ length: weekNum.value },
        () => Array.from({ length: 7 },
          () => Array.from({ length: 5 },
            () => 0)))

      if (courseList.value) {
        // process course list
        for (const courseItem of courseList.value) {
          const { start, duration, week, weeks } = courseItem
          for (const w of weeks) {
            const dayCourseList = parsedCourseList[w - 1][week - 1]
            dayCourseList[Math.floor(start / 2)]++
            // some courses may last more than 2 times
            if (duration > 2)
              dayCourseList[Math.floor(start / 2 + 1)]++
          }
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
      return courseList.value.filter((item) => {
        return item.weeks.includes(currentWeekIndex.value + 1) && item.week === week && item.start === start
      })
    }

    /**
     * list of course for a certain course item time with map
     * @param courseItem the course item
     */
    function hasConflictCourseByMap(courseItem: CourseModel): CourseModel[] {
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

    /**
     * change current week index
     * @param weekIndex the new week index
     */
    function setCurrentWeekIndex(weekIndex: number) {
      conflictCourseMap.clear()
      currentWeekIndex.value = weekIndex
      // change current month
      const someDate = new Date(startDate.value)
      someDate.setDate(someDate.getDate() + weekIndex * 7)
      currentMonth.value = someDate.getMonth() + 1
    }

    /**
     * reset course bg color
     */
    function resetCourseBgColor() {
      colorMap.clear()
      if (courseList.value) {
        courseList.value.map(courseItem =>
          Object.assign(courseItem, { bgColor: getCourseBgColor(courseItem) }),
        )
      }
    }

    /**
     * get course item background color
     * @param courseItem course item
     * @returns course color
     */
    function getCourseBgColor(courseItem: CourseModel): string {
      const colorArray = colorArrayList[colorArrayIndex.value]
      const { title } = courseItem
      if (!colorMap.has(title))
        colorMap.set(title, colorArray[colorMap.size % colorArray.length])
      return colorMap.get(title) || '#FFFFFF'
    }

    watch(
      () => colorArrayIndex.value,
      () => resetCourseBgColor(),
    )

    /**
     * set a course to top when there have more than one course in the same time
     * @param courseItem course item
     */
    function setCourseItemTop(courseItem: CourseModel) {
      deleteCourseItem(courseItem)
      courseList.value.unshift(courseItem)
    }

    /**
     * delete a course
     * @param courseItem course item
     */
    function deleteCourseItem(courseItem: CourseModel) {
      conflictCourseMap.clear()
      const { title, week, start } = courseItem
      for (let i = 0; i < courseList.value.length; i++) {
        const item = courseList.value[i]
        if (item.title === title && item.week === week && item.start === start)
          courseList.value.splice(i, 1)
      }
    }

    /**
     * delete a course by title
     * @param courseTitle course title
     */
    function deleteCourseItemByTitle(courseTitle: string) {
      conflictCourseMap.clear()
      for (let i = 0; i < courseList.value.length; i++) {
        const item = courseList.value[i]
        if (item.title === courseTitle)
          courseList.value.splice(i, 1)
      }
    }

    return {
      startDate,
      currentMonth,
      courseList,
      setCourseList,
      weekCourseList,
      parsedCourseList,
      originalWeekIndex,
      currentWeekIndex,
      originalWeekWeekIndex,
      currentWeekDayArray,
      colorArrayIndex,
      setStartDay,
      setCurrentWeekIndex,
      getConflictCourse,
      hasConflictCourseByMap,
      setCourseItemTop,
      deleteCourseItem,
      deleteCourseItemByTitle,
    }
  },
)

// Need to be used outside the setup
export function useCourseStoreWidthOut() {
  return useCourseStore(store)
}
