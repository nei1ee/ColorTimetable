<script setup lang="ts">
import { useAppStore } from '@/store/modules/app'
import { useCourseStore } from '@/store/modules/course'

const appStore = useAppStore()
const courseStore = useCourseStore()

defineProps({
  showCourseAction: {
    type: Boolean,
    default: false,
  },
})

const { originalWeekIndex, currentWeekIndex } = toRefs(courseStore)

const scrollLeft = () => {
  if (originalWeekIndex.value === currentWeekIndex.value)
    return originalWeekIndex.value * 60
  return currentWeekIndex.value * 60
}
</script>

<template>
  <div :style="{ 'padding-top': appStore.customBarHeight + 'px' }" class="dark:bg-transparent">
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
  </div>
</template>
