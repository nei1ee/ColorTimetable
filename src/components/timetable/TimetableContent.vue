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

const { customBarHeight } = useAppStore()
const { weekCourseList } = storeToRefs(useCourseStore())
const { hasConflictCourseByMap } = useCourseStore()

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
      class="min-h-max pb-safe grid grid-flow-col p-1 transition-all z-20 gap-1 grid-rows-10 grid-cols-[0.7fr_repeat(7,1fr)] duration-300"
      :class="showCourseAction ? 'pt-30' : 'pt-10'"
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
          class="border-white rounded-lg border-2 border-opacity-70 text-center p-1 col-span-1 relative"
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
              class="bg-white rounded h-1.5 top-1 right-1 w-1.5 absolute"
            />
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
