<script setup lang="ts">
import TimetableAction from './TimetableAction.vue'
import TimetableHeader from './TimetableHeader.vue'
import type { CourseModel } from '~/stores/course'
import { courseTimeList } from '~/stores/course'

withDefaults(
  defineProps<{ showCourseAction: boolean }>(), {
    showCourseAction: false,
  },
)

const emit = defineEmits(['courseItemClick'])

const { customBarHeight } = storeToRefs(useAppStore())
const { weekCourseList, currentWeekIndex, originalWeekIndex } = storeToRefs(useCourseStore())
const { hasConflictCourseByMap, setCurrentWeekIndex } = useCourseStore()

const startX = ref(0)
const startY = ref(0)
const towardsX = ref(0)
const towardsY = ref(0)

function handleTouchStart(e: TouchEvent) {
  startX.value = e.touches[0].clientX
  startY.value = e.touches[0].clientY
}

function handleTouchMove(e: TouchEvent) {
  towardsX.value = e.touches[0].clientX - startX.value
  towardsY.value = e.touches[0].clientY - startY.value
}

function handleTouchEnd() {
  let currentWeekIndexTemp = currentWeekIndex.value
  if (towardsX.value === 0 || Math.abs(towardsY.value) > 50)
    return
  if (towardsX.value > 50) {
    if (currentWeekIndexTemp === 0)
      return
    currentWeekIndexTemp--
  }
  else if (towardsX.value < -50) {
    if (currentWeekIndexTemp === weekCourseList.value.length - 1)
      return
    currentWeekIndexTemp++
  }
  setCurrentWeekIndex(currentWeekIndexTemp)
}

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
  <div class="overflow-y-scroll relative dark:bg-#121212" :style="{ height: `calc(100vh - ${customBarHeight}px)` }">
    <div class="bg-white w-full top-0 z-10 fixed dark:bg-#121212" :style="{ 'padding-top': `${customBarHeight}px` }">
      <TimetableAction :show-course-action="showCourseAction" />
      <TimetableHeader />
    </div>
    <div
      class="min-h-max pb-safe grid grid-flow-col p-1 transition-all z-20 gap-1 grid-rows-10 grid-cols-[0.7fr_repeat(7,1fr)] duration-300 bg-white dark:bg-#121212"
      :class="showCourseAction ? 'pt-31' : 'pt-11'"
      @touchstart="handleTouchStart" @touchmove="handleTouchMove" @touchend="handleTouchEnd"
    >
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
      <template v-for="(courseItem, _courseIndex) of weekCourseList" :key="_courseIndex">
        <div
          class="border-white rounded-lg border-1 border-opacity-70 text-center p-0.5 relative"
          :style="[getCoursePosition(courseItem), `background-color: ${hasConflictCourseByMap(courseItem)[0].bgColor}`]"
          @click="emit('courseItemClick', courseItem)"
        >
          <div class="flex flex-col h-full text-white text-xs w-full justify-around items-center">
            <div class="font-medium break-all">
              {{ hasConflictCourseByMap(courseItem)[0].title }}
            </div>
            <div class="break-all">
              <div class="text-8px i-carbon-location-current" />
              {{ hasConflictCourseByMap(courseItem)[0].location }}
            </div>
            <div
              v-if="hasConflictCourseByMap(courseItem).length > 1"
              class="rounded h-1 top-1 left-1 right-1 absolute bg-white/80"
            />
          </div>
        </div>
      </template>
    </div>
    <div
      class="bg-light-blue dark:bg-light-blue-600 text-white text-sm fixed top-40% z-30 pl-4 py-2 pr-2 rounded-l-full transition-all duration-300"
      :class="originalWeekIndex !== currentWeekIndex ? 'right-0' : '-right-full'"
      @click="setCurrentWeekIndex(originalWeekIndex)"
    >
      返回本周
    </div>
  </div>
</template>
