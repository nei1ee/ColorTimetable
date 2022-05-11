<script setup lang="ts">
import { useAppStore } from '@/store/modules/app'
import { useCourseStore } from '@/store/modules/course'
import type { CourseModel } from '@/store/modules/course'
import TimetableContent from '@/components/timetable/TimetableContent.vue'
import CourseActionSheet from '@/components/timetable/CourseActionSheet.vue'

const appStore = useAppStore()
const courseStore = useCourseStore()

const showCourseAction = ref(false)

// mock api
uni.request({
  url: 'https://www.fastmock.site/mock/7074538d5f28bc8bcab58385107d778f/api/course',
  success: (res: any) => {
    // set semester course data
    courseStore.setCourseList(res.data.data as CourseModel[])
  },
})

// set the start date
const someDate = new Date()
// ` - 8 * 7 + (someDate.getDay() + 1) % 7` just to fix the current week
someDate.setDate(someDate.getDate() - 8 * 7 + (someDate.getDay() + 1) % 7)
courseStore.setStartDay(someDate)

function handleCreateCourse() {
  uni.navigateTo({
    url: '/pages/index/detail',
  })
}

// handle course item click
const showActionSheet = ref(false)
const clickedCourseItem = ref<CourseModel>()
function handleShowActionSheet(courseItem: CourseModel) {
  showActionSheet.value = true
  clickedCourseItem.value = courseItem
}

function handleCloseActionSheet() {
  showActionSheet.value = false
}
</script>

<template>
  <div class="font-mono text-gray-500" :class="appStore.darkMode ? 'dark' : ''">
    <div class="bg-gray-100 dark:(bg-#121212 !text-gray-200) ">
      <!-- custom bar -->
      <div class="bg-white top-0 sticky dark:bg-#121212">
        <div
          class="text-center px-6 relative"
          :style="{ 'margin-top': `${appStore.statusBarHeight}px`, 'height': `${appStore.customBarHeight - appStore.statusBarHeight}px` }"
        >
          <div class="h-full text-xl left-4 i-carbon-add absolute" @click="handleCreateCourse" />
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
      <!-- timetable main content -->
      <TimetableContent :show-course-action="showCourseAction" @course-item-click="handleShowActionSheet" />
      <!-- course card -->
      <CourseActionSheet
        :show-action-sheet="showActionSheet" :course-item="clickedCourseItem"
        @cancel="handleCloseActionSheet"
      />
    </div>
  </div>
</template>
