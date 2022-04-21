<script setup lang="ts">
import TimetableHeader from './TimetableHeader.vue'
import type { CourseModel } from '@/store/modules/course'
import { useAppStore } from '@/store/modules/app'
import { courseTimeList, useCourseStore } from '@/store/modules/course'

const appStore = useAppStore()
const courseStore = useCourseStore()

/**
 * get course item position
 * @param item course item
 * @returns css style
 */
const getCoursePosition = (item: CourseModel) => {
  return {
    'grid-row': `${item.start} / ${item.start + item.duration}`,
    'grid-column': `${item.week + 1} / ${item.week + 1 + 1}`,
  }
}

const emit = defineEmits(['handleCourseItemClick'])
</script>

<template>
  <TimetableHeader />
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
    <template v-for="(weekCourse, weekIndex) of courseStore.semesterCourseList[courseStore.currentWeekIndex]" :key="weekIndex">
      <template v-for="(dayCourse, dayIndex) of weekCourse" :key="dayIndex">
        <div
          v-if="dayCourse.length"
          class="border-white rounded-lg border-2 border-opacity-50 text-center p-1 relative box-content col-span-1"
          :style="[getCoursePosition(dayCourse[0]), `background-color: ${courseStore.getCourseBgColor(dayCourse[0].title)}${appStore.darkMode ? '50' : ''}`]"
          @click="emit('handleCourseItemClick', dayCourse)"
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
</template>
