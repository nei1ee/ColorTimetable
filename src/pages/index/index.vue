<script setup lang="ts">
import { useAppStore } from '@/store/modules/app'
import { useCourseStore } from '@/store/modules/course'
import type { CourseList, CourseModel } from '@/store/modules/course'
import TimetableAction from '@/components/timetable/TimetableAction.vue'
import TimetableContent from '@/components/timetable/TimetableContent.vue'
import CourseActionSheet from '@/components/timetable/CourseActionSheet.vue'

const appStore = useAppStore()
const courseStore = useCourseStore()

const showCourseAction = ref(false)
const showDrawerAction = ref(false)

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
const showActionSheet = ref(false)
const courseList = ref<CourseModel[]>()
function handleShowActionSheet(dayCourse: CourseModel[]) {
  showActionSheet.value = true
  courseList.value = dayCourse
}

function handleCloseActionSheet() {
  showActionSheet.value = false
  courseList.value = []
}
</script>

<template>
  <!-- :style="{ 'padding-top': `${appStore.customBarHeight}px` }" -->
  <div class="font-mono text-gray-500 dark:bg-#121212 dark:text-gray-200" :class="appStore.darkMode ? 'dark' : ''">
    <!-- custom bar -->
    <div class="bg-white top-0 sticky dark:bg-#121212">
      <div
        class="text-center px-6 relative"
        :style="{ 'margin-top': `${appStore.statusBarHeight}px`, 'height': `${appStore.customBarHeight - appStore.statusBarHeight}px` }"
      >
        <div
          class="flex h-full mx-auto w-20 justify-center items-center inline-block"
          @click="showCourseAction = !showCourseAction"
        >
          {{ `第${courseStore.currentWeekIndex + 1}周` }}
          <div
            class="transition-transform duration-300 i-carbon-chevron-up"
            :class="showCourseAction ? 'rotate-180' : 'rotate-0'"
          />
        </div>
      </div>
    </div>
    <TimetableAction :show-course-action="showCourseAction" />
    <!-- timetable body -->
    <TimetableContent @handle-course-item-click="handleShowActionSheet" />
    <!-- course card -->
    <CourseActionSheet
      :show-action-sheet="showActionSheet" :course-list="courseList"
      @cancel="handleCloseActionSheet"
    />
  </div>
</template>
