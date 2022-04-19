<script setup lang="ts">
import { useCourseStyleEffect } from './homeEffect'
import { useAppStore } from '@/store/modules/app'
import { courseTimeList, useCourseStore, weekTitle } from '@/store/modules/course'
import type { CourseList, CourseModel } from '@/store/modules/course'

const appStore = useAppStore()
const courseStore = useCourseStore()

const { getCourseRowColumnStart2End, getCourseBackgroundColor } = useCourseStyleEffect()

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

const {
  currentMonth,
  originalWeeksWeekIndex,
  originalWeekIndex,
  currentWeekIndex,
  currentWeekDayArray,
} = toRefs(courseStore)

const scrollLeft = () => {
  if (originalWeekIndex.value === currentWeekIndex.value)
    return originalWeekIndex.value * 60
  return currentWeekIndex.value * 60
}

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
            .splice(
              courseItemIndex,
              1,
            )
        }
      }
    },
  })
}

</script>

<template>
  <div class="font-mono" :class="appStore.darkMode ? 'dark' : ''">
    <div class="text-gray-500 dark:text-gray-200">
      <!-- custom bar -->
      <div class="bg-white top-0 right-0 left-0 z-50 fixed dark:bg-#121212">
        <div
          class="text-center" :style="{
            'padding-top': appStore.statusBarHeight + 'px',
            height: (appStore.customBarHeight - appStore.statusBarHeight) + 'px'
          }"
        >
          <div class="flex h-full justify-center items-center" @click="showCourseAction = !showCourseAction">
            {{ `第${currentWeekIndex + 1}周` }}
            <div :class="showCourseAction ? 'i-carbon-chevron-down' : 'i-carbon-chevron-up'" />
          </div>
        </div>
      </div>
      <div class="dark:bg-#121212" :style="{ 'padding-top': appStore.customBarHeight + 'px' }">
        <!-- course action -->
        <scroll-view
          v-if="showCourseAction" class="text-center whitespace-nowrap" scroll-x scroll-with-animation
          :scroll-left="scrollLeft()"
        >
          <template v-for="(weeksTimetable, weeksIndex) of courseStore.semesterCourseList" :key="weeksIndex">
            <div class="p-2 inline-block" @click="courseStore.setCurrentWeekIndex(weeksIndex)">
              <div
                class="rounded-lg py-1 px-2 dark:bg-opacity-50"
                :class="originalWeekIndex === weeksIndex ? 'bg-gray-200' : currentWeekIndex === weeksIndex ? 'bg-gray-300 dark:bg-gray-500' : ''"
              >
                <div class="text-xs">
                  {{ `第${weeksIndex + 1}周` }}
                </div>
                <div class="h-10 grid grid-flow-col w-10 grid-cols-5 grid-rows-5">
                  <template v-for="(weekWeekTimetable, weekWeekIndex) of weeksTimetable" :key="weekWeekIndex">
                    <template v-if="weekWeekIndex < 5">
                      <template v-for="(item, index) of weekWeekTimetable" :key="index">
                        <div
                          class="rounded-full mx-auto bg-gray-100 h-1.5 w-1.5"
                          :class="item.length >= 1 ? '!bg-light-blue-500' : ''"
                        />
                      </template>
                    </template>
                  </template>
                </div>
              </div>
            </div>
          </template>
        </scroll-view>
        <!-- course body -->
        <div class="relative">
          <div class="shadow-sm grid px-1 gap-1 grid-cols-[0.7fr_repeat(7,1fr)]">
            <div class="flex flex-col text-sm items-center justify-center">
              <p class="font-medium">
                {{ `${currentMonth}月` }}
              </p>
            </div>
            <div
              v-for="(item, index) in currentWeekDayArray" :key="index"
              class="border-y-transparent border-x-none flex flex-col border-t-4 border-b-4 text-xs justify-evenly items-center"
              :class="originalWeekIndex === currentWeekIndex && originalWeeksWeekIndex === index ? 'bg-light-blue-200 !border-b-light-blue-500 dark:bg-opacity-50' : ''"
            >
              <p class="font-medium">
                {{ weekTitle[index] }}
              </p>
              <p>{{ item }}</p>
            </div>
          </div>
          <div class="grid grid-flow-col p-1 gap-1 grid-rows-10 grid-cols-[0.7fr_repeat(7,1fr)]">
            <template v-for="(courseTime, courseIndex) in courseTimeList" :key="courseIndex">
              <div class="flex flex-col text-sm min-h-18 justify-evenly items-center">
                <p class="font-medium">
                  {{ courseIndex + 1 }}
                </p>
                <br>
                <div class="leading-tight px-0.5 text-10px">
                  {{ courseTime.s }}
                  <br>
                  {{ courseTime.e }}
                </div>
              </div>
            </template>
            <template v-for="(weekCourse, weekIndex) of courseStore.semesterCourseList[currentWeekIndex]" :key="weekIndex">
              <template v-for="(dayCourse, dayIndex) of weekCourse" :key="dayIndex">
                <div
                  v-if="dayCourse.length"
                  class="border-white rounded-lg border-2 border-opacity-50 text-center p-1 relative box-content"
                  :style="[getCourseRowColumnStart2End(dayCourse[0]), `background-color: ${getCourseBackgroundColor(dayCourse[0].title)}${appStore.darkMode ? '50' : ''}`]"
                  @click="handleCourseItemClick(dayCourse)"
                >
                  <div class="flex flex-col h-full text-white text-xs w-full justify-around items-center">
                    <div class="font-medium">
                      {{ dayCourse[0]?.title }}
                    </div>
                    <div class="break-all">
                      <div class="text-8px i-carbon-location-current" />
                      {{ `${dayCourse[0]?.location}` }}
                    </div>
                    <div v-if="dayCourse.length > 1" class="bg-white rounded h-1.5 top-1 right-1 w-1.5 absolute" />
                  </div>
                </div>
              </template>
            </template>
          </div>
          <div
            v-if="isCourseItemClicked"
            class="flex flex-col bg-dark-100 bg-opacity-50 top-0 right-0 bottom-0 left-0 z-10 absolute justify-center items-center"
            @click="isCourseItemClicked = false"
          >
            <template v-for="(courseItem, index) of currentCourseItem" :key="index">
              <div
                class="border-white rounded-xl border-2 border-opacity-50 text-white mb-10 p-6 pb-4 w-60% z-11 box-content"
                :style="[`background-color: ${getCourseBackgroundColor(courseItem.title)}`]" @click.stop
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
    </div>
  </div>
</template>
