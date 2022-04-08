import { defineStore } from 'pinia'
import type { CourseList } from '../types'
import { store } from '@/store'

type Nullable<T> = T | null

interface CourseState {
  startDate: Date | string
  courseList: Nullable<CourseList>
  currentMonth: number
  originalWeekIndex: number
  currentWeekIndex: number
  colorIndex: number
}

export const useCourseStore = defineStore({
  id: 'course',
  state: (): CourseState => ({
    startDate: '',
    currentMonth: -1,
    originalWeekIndex: -1,
    currentWeekIndex: -1,
    courseList: null,
    colorIndex: -1,
  }),
  getters: {
    getCurrentWeekDayArray(): number[] {
      const weekIndex = this.currentWeekIndex
      const someDate = new Date(this.startDate)
      someDate.setDate(someDate.getDate() + weekIndex * 7)
      const dayArray: number[] = []
      dayArray.push(someDate.getDate())
      for (let i = 0; i < 6; i++) {
        someDate.setDate(someDate.getDate() + 1)
        dayArray.push(someDate.getDate())
      }
      return dayArray
    },
    getOriginalWeeksWeekIndex(): number {
      const week = new Date().getDay()
      return week === 0 ? 6 : week - 1
    },
    getCourseList(): CourseList {
      return this.courseList || []
    },
  },
  actions: {
    setStartDay(startDate: string | Date) {
      this.startDate = new Date(startDate)
      // set original week index
      const days = new Date().getTime() - this.startDate.getTime()
      this.originalWeekIndex = Math.floor((days / (1000 * 60 * 60 * 24)) / 7)
      // set current week index
      this.setCurrentWeekIndex(this.originalWeekIndex)
    },
    setCurrentWeekIndex(weekIndex: number) {
      this.currentWeekIndex = weekIndex
      // change current month
      const someDate = new Date(this.startDate)
      someDate.setDate(someDate.getDate() + weekIndex * 7)
      this.currentMonth = someDate.getMonth() + 1
    },
    setCourseList(info: CourseList) {
      this.courseList = info
    },
  },
})

// Need to be used outside the setup
export function useCourseStoreWidthOut() {
  return useCourseStore(store)
}
