<script setup lang="ts">
import { weekTitle } from '~/stores/course'

const {
  isStart, currentMonth, originalWeekIndex, currentWeekIndex,
  originalWeekWeekIndex, currentWeekDayArray,
} = storeToRefs(useCourseStore())

const isCurrentWeek = (weekIndex: number) => {
  if (!isStart.value)
    return false
  if (!originalWeekIndex.value || !currentWeekIndex.value || !originalWeekWeekIndex.value)
    return false

  return originalWeekIndex.value === currentWeekIndex.value && originalWeekWeekIndex.value === weekIndex
}
</script>

<template>
  <div class="h-10 shadow-sm px-1 top-0" grid="~ cols-[0.7fr_repeat(7,1fr)] gap-1">
    <div class="flex font-medium text-sm items-center justify-center">
      {{ `${currentMonth}月` }}
    </div>
    <div
      v-for="(item, index) in currentWeekDayArray" :key="index"
      class="text-xs transition-all duration-300 !bg-op40"
      flex="~ col" justify-evenly items-center
      b="y-transparent x-none t-4 b-4"
      :class="isCurrentWeek(index) ? 'bg-light-blue-300 !b-b-light-blue-500' : ''"
    >
      <p class="font-medium">
        {{ weekTitle[index] }}
      </p>
      <p>{{ item }}</p>
    </div>
  </div>
</template>
