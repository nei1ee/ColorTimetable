<script setup lang="ts">
import { useAppStore } from '@/store/modules/app'
import { useCourseStore } from '@/store/modules/course'
import type { CourseList, CourseModel } from '@/store/modules/course'
import TimetableAction from '@/components/timetable/TimetableAction.vue'
import TimetableContent from '@/components/timetable/TimetableContent.vue'

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
const isCourseItemClicked = ref(false)
const currentCourseItem = ref<CourseModel[]>()
const handleCourseItemClick = (dayCourse: CourseModel[]) => {
  isCourseItemClicked.value = true
  currentCourseItem.value = dayCourse
}

function deleteCourseItem(courseItem: CourseModel, courseItemIndex: number) {
  uni.showModal({
    title: '警告',
    content: `确定删除该课程吗？\n此操作只会删除星期${courseItem?.week}的课时`,
    success: (res) => {
      if (res.confirm)
        courseStore.handleDeleteCourseItem(courseItem, courseItemIndex)
    },
  })
}

function handleAddCourse() {
  console.log('add')
}

function handleChangeColor() {
  console.log('color')
}

</script>

<template>
  <div
    class="font-mono" :class="appStore.darkMode ? 'dark' : ''"
    :style="{ 'padding-top': appStore.customBarHeight + 'px' }"
  >
    <div class="text-gray-500 relative dark:bg-#121212 dark:text-gray-200">
      <!-- custom bar -->
      <div class="bg-white top-0 right-0 left-0 z-50 fixed dark:bg-#121212">
        <div
          class="text-center px-6 relative"
          :style="{ 'margin-top': appStore.statusBarHeight + 'px', height: (appStore.customBarHeight - appStore.statusBarHeight) + 'px' }"
        >
          <!-- <div class="flex p-2 top-0 bottom-0 absolute items-center" @click="showDrawerAction = !showDrawerAction">
            <div class="i-carbon-overflow-menu-horizontal" />
          </div> -->
          <div
            class="flex h-full mx-auto w-20 justify-center items-center inline-block"
            @click="showCourseAction = !showCourseAction"
          >
            {{ `第${courseStore.currentWeekIndex + 1}周` }}
            <div
              class="transition-transform duration-300 i-carbon-chevron-up"
              :class="showCourseAction ? ' rotate-180' : ''"
            />
          </div>
        </div>
      </div>
      <TimetableAction :show-course-action="showCourseAction" />
      <TimetableContent @handle-course-item-click="handleCourseItemClick" />
      <!-- course card -->
      <div
        v-if="isCourseItemClicked && currentCourseItem?.length"
        class="flex flex-col bg-dark-100 bg-opacity-50 top-0 right-0 bottom-0 left-0 z-10 absolute justify-center items-center"
        @click="isCourseItemClicked = false"
      >
        <template v-for="(courseItem, index) of currentCourseItem" :key="index">
          <div
            class="border-white rounded-xl border-2 border-opacity-50 text-white mb-10 p-6 pb-4 transition-all w-60% z-11 duration-1000 box-content"
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
                @click="courseStore.setCourseItemTop(courseItem, index)"
              />
              <div class="i-carbon-edit" />
              <div class="i-carbon-delete" @click="deleteCourseItem(courseItem, index)" />
            </div>
          </div>
        </template>
      </div>
      <!-- drawer -->
      <div
        v-if="showDrawerAction"
        class="bg-dark-100 bg-opacity-50 top-0 right-0 bottom-0 left-0 z-10 absolute"
        @click="showDrawerAction = !showDrawerAction"
      >
        <div
          class="bg-white p-4 animate-wiggle dark:bg-#121212"
          @click.stop
        >
          <div class="flex text-4xl gap-2 items-center justify-start">
            <div class="text-green-500 i-mdi-plus-circle" @click="handleAddCourse" />
            <div class="text-violet-500 i-mdi-palette" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
