<script setup lang="ts">
import { useCourseStore, weekTitle } from '@/store/modules/course'
const courseStore = useCourseStore()

const {
  currentMonth,
  originalWeeksWeekIndex,
  originalWeekIndex,
  currentWeekIndex,
  currentWeekDayArray,
} = toRefs(courseStore)
</script>

<template>
  <div class="shadow-sm grid px-1 gap-1 grid-cols-[0.7fr_repeat(7,1fr)]">
    <div class="flex items-center justify-center text-sm font-medium">
      {{ `${currentMonth}月` }}
    </div>
    <div
      v-for="(item, index) in currentWeekDayArray" :key="index"
      class="border-y-transparent border-x-none flex flex-col border-t-4 border-b-4 text-xs justify-evenly items-center transition duration-300"
      :class="originalWeekIndex === currentWeekIndex && originalWeeksWeekIndex === index ? 'bg-light-blue-200 !border-b-light-blue-500 dark:bg-opacity-50' : ''"
    >
      <p class="font-medium">
        {{ weekTitle[index] }}
      </p>
      <p>{{ item }}</p>
    </div>
  </div>
</template>
<style scoped>

</style>
