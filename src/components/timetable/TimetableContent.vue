<script setup lang="ts">
import TimetableAction from './TimetableAction.vue'
import TimetableHeader from './TimetableHeader.vue'
import type { CourseModel } from '@/store/modules/course'
import { useAppStore } from '@/store/modules/app'
import { courseTimeList, useCourseStore } from '@/store/modules/course'

withDefaults(
  defineProps<{ showCourseAction: boolean }>(), {
    showCourseAction: false,
  },
)

const emit = defineEmits(['courseItemClick'])

const appStore = useAppStore()
const courseStore = useCourseStore()

const { hasConflictCourse } = courseStore

/**
 * get course position
 * @param item course item
 * @returns css style
 */
function getCoursePosition(item: CourseModel) {
  return {
    'grid-row': `${item.start} / ${item.start + item.duration}`,
    'grid-column': `${item.week + 1} / ${item.week + 1 + 1}`,
  }
}
</script>

<template>
  <div class="overflow-y-scroll relative dark:bg-#121212" :style="{ height: `calc(100vh - ${appStore.customBarHeight}px)` }">
    <div class="bg-white top-0 z-10 sticky dark:bg-#121212">
      <TimetableAction :show-course-action="showCourseAction" />
      <TimetableHeader />
    </div>
    <div class="min-h-max pb-safe grid grid-flow-col p-1 z-20 gap-1 grid-rows-10 grid-cols-[0.7fr_repeat(7,1fr)]">
      <template v-for="(courseTime, courseIndex) in courseTimeList" :key="courseIndex">
        <div class="flex flex-col text-sm min-h-18 justify-evenly items-center">
          <div class="font-medium">
            {{ courseIndex + 1 }}
          </div>
          <div class="leading-tight px-0.5 text-8px">
            {{ courseTime.s }}<br>{{ courseTime.e }}
          </div>
        </div>
      </template>
      <template v-for="(courseItem, courseIndex) of courseStore.weekCourseList" :key="courseIndex">
        <div
          class="border-white rounded-lg border-2 border-opacity-50 text-center p-1 col-span-1 relative box-content"
          :style="[getCoursePosition(courseItem), `background-color: ${hasConflictCourse(courseItem)[0].bgColor}`]"
          @click="emit('courseItemClick', hasConflictCourse(courseItem))"
        >
          <div class="flex flex-col h-full text-white text-xs w-full justify-around items-center">
            <div class="font-medium">
              {{ hasConflictCourse(courseItem)[0].title }}
            </div>
            <div class="break-all">
              <div class="text-8px i-carbon-location-current" />
              {{ hasConflictCourse(courseItem)[0].location }}
            </div>
            <div v-if="hasConflictCourse(courseItem).length > 1" class="bg-white rounded h-1.5 top-1 right-1 w-1.5 absolute" />
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
