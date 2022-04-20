<script setup lang="ts">
import { useAppStore } from '@/store/modules/app'
import { useCourseStore } from '@/store/modules/course'
import type { CourseList, CourseModel } from '@/store/modules/course'
import TimetableAction from '@/components/timetable/TimetableAction.vue'
import TimetableBody from '@/components/timetable/TimetableBody.vue'

const appStore = useAppStore()
const courseStore = useCourseStore()

const showCourseAction = ref(false)

// mock api
uni.request({
  url: 'https://www.fastmock.site/mock/7074538d5f28bc8bcab58385107d778f/api/timetable',
  success: (res: any) => {
    // set semester course data
    courseStore.semesterCourseList = res.data.data as CourseList
  },
})

// set the start date
const someDate = new Date()
// ` - 8 * 7 + (someDate.getDay() + 1) % 7` just to fix the current week
someDate.setDate(someDate.getDate() - 8 * 7 + (someDate.getDay() + 1) % 7)
courseStore.setStartDay(someDate)

// handle course item click
const isCourseItemClicked = ref(false)
const currentCourseItem = ref<CourseModel[]>()
const handleCourseItemClick = (dayCourse: CourseModel[]) => {
  isCourseItemClicked.value = true
  currentCourseItem.value = dayCourse
}

const setCourseItemTop = (courseItem: CourseModel, courseItemIndex: number) => {
  if (!courseItemIndex)
    return
  const { start, week, weeks } = courseItem
  for (let i = 0; i < weeks.length; i++) {
    const dayDayCourse = courseStore.semesterCourseList[weeks[i] - 1][week - 1][Math.floor(start / 2)]
    if (dayDayCourse.length > 1) {
      const temp = dayDayCourse[courseItemIndex]
      dayDayCourse.splice(courseItemIndex, 1)
      dayDayCourse.unshift(temp)
    }
  }
}

const deleteCourseItem = (courseItem: CourseModel, courseItemIndex: number) => {
  const { start, week, weeks } = courseItem
  uni.showModal({
    title: '警告',
    content: `确定删除该课程吗？\n此操作只会删除星期${week}的课时`,
    success: (res) => {
      if (res.confirm) {
        for (let i = 0; i < weeks.length; i++) {
          courseStore.semesterCourseList[weeks[i] - 1][week - 1][Math.floor(start / 2)]
            .splice(courseItemIndex, 1)
        }
      }
    },
  })
}
</script>

<template>
  <div class="font-mono" :class="appStore.darkMode ? 'dark' : ''">
    <div class="text-gray-500 dark:text-gray-200 relative dark:bg-#121212">
      <!-- custom bar -->
      <div class="bg-white top-0 right-0 left-0 z-50 fixed dark:bg-#121212">
        <div
          class="text-center" :style="{
            'padding-top': appStore.statusBarHeight + 'px',
            height: (appStore.customBarHeight - appStore.statusBarHeight) + 'px'
          }"
        >
          <div class="flex h-full justify-center items-center" @click="showCourseAction = !showCourseAction">
            {{ `第${courseStore.currentWeekIndex + 1}周` }}
            <div :class="showCourseAction ? 'i-carbon-chevron-up' : 'i-carbon-chevron-down'" />
          </div>
        </div>
      </div>
      <TimetableAction :show-course-action="showCourseAction" />
      <TimetableBody @handle-course-item-click="handleCourseItemClick" />
      <div
        v-if="isCourseItemClicked"
        class="flex flex-col bg-dark-100 bg-opacity-50 top-0 right-0 bottom-0 left-0 z-10 absolute justify-center items-center"
        @click="isCourseItemClicked = false"
      >
        <template v-for="(courseItem, index) of currentCourseItem" :key="index">
          <div
            class="border-white rounded-xl border-2 border-opacity-50 text-white mb-10 p-6 pb-4 w-60% z-11 box-content"
            :style="[`background-color: ${courseStore.getCourseBgColor(courseItem.title)}`]" @click.stop
          >
            <div class="font-medium text-lg text-center mb-4">
              {{ courseItem.title }}
            </div>
            <div class="flex justify-start items-center">
              <div class="mr-1 i-mdi-clock" />
              {{ courseItem.time }}
            </div>
            <div class="flex justify-start items-center">
              <div class="mr-1 i-mdi-navigation-variant" />
              {{ courseItem.location }}
            </div>
            <div class="flex">
              <div class="flex justify-start items-center">
                <div class="mr-1 i-mdi-feather" />
                {{ courseItem.period }}
              </div>
              <div class="flex ml-4 justify-start items-center">
                <div class="mr-1 i-mdi-star" />
                {{ courseItem.credit }}
              </div>
            </div>
            <div class="flex mt-2 justify-around items-center">
              <div
                :class="index ? 'i-carbon-up-to-top' : 'i-carbon-error'"
                @click="setCourseItemTop(courseItem, index)"
              />
              <div class="i-carbon-edit" />
              <div class="i-carbon-delete" @click="deleteCourseItem(courseItem, index)" />
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
