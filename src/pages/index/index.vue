<script setup lang="ts">
import type { CourseModel } from '~/stores/course'

const { customBarHeight, statusBarHeight } = useAppStore()
const { setPageConfig } = usePageStore()
const courseStore = useCourseStore()

onShow(() => {
  setPageConfig({ showNavBar: false })
})

// mock api
uni.request({
  url: 'https://www.fastmock.site/mock/7074538d5f28bc8bcab58385107d778f/api/course',
  success: (res: any) => {
    // set semester course data
    courseStore.setCourseList(res.data.data as CourseModel[])
  },
})

const showCourseAction = ref(false)

// set the start date
const someDate = new Date()
// ` - 8 * 7 + (someDate.getDay() + 1) % 7` just to fix the current week
someDate.setDate(someDate.getDate() - 8 * 7 + (someDate.getDay() + 1) % 7)
courseStore.setStartDay(someDate)

function handleCreateCourse() {
  uni.navigateTo({
    url: '/pages/detail/detail',
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
  <BasePage>
    <div
      class="bg-light-blue-500 text-white w-full top-0 z-200 fixed dark:bg-light-blue-600"
      :style="{ height: `${customBarHeight}px` }"
    >
      <div :style="{ 'padding-top': `${statusBarHeight}px`, 'height': `${customBarHeight - statusBarHeight}px` }">
        <div class="h-full text-center px-6 relative">
          <div class="h-full text-xl left-4 i-carbon-add absolute" @click="handleCreateCourse" />
          <div
            class="flex h-full mx-auto w-20 justify-center items-center inline-block text-lg"
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
    </div>
    <!-- timetable main content -->
    <UTimetableContent :show-course-action="showCourseAction" @course-item-click="handleShowActionSheet" />
    <!-- course card -->
    <UCourseActionSheet
      :show-action-sheet="showActionSheet" :course-item="clickedCourseItem"
      @cancel="handleCloseActionSheet"
    />
  </BasePage>
</template>

<style scoped>
</style>
