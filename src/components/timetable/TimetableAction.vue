<script setup lang="ts">
const props = defineProps<{ showCourseAction: boolean }>()

const courseStore = useCourseStore()

const { originalWeekIndex, currentWeekIndex } = toRefs(courseStore)

const scrollTo = ref('week0')

watch(
  () => +props.showCourseAction + courseStore.currentWeekIndex,
  () => {
    if (props.showCourseAction)
      scrollTo.value = `week${courseStore.currentWeekIndex - 1}`
  })
</script>

<template>
  <scroll-view
    class="transition-height duration-300 overflow-scroll whitespace-nowrap"
    :class="showCourseAction ? 'h-20' : 'h-0'"
    scroll-x scroll-with-animation
    :scroll-into-view="scrollTo"
  >
    <template v-for="(weeksTimetable, weeksIndex) of courseStore.parsedCourseList" :key="weeksIndex">
      <div
        :id="`week${weeksIndex + 1}`"
        class="text-center py-1 px-2 inline-block"
        @click="courseStore.setCurrentWeekIndex(weeksIndex)"
      >
        <div
          class="rounded-lg py-1 px-2 dark:bg-opacity-50"
          :class="originalWeekIndex === weeksIndex ? 'bg-gray-200' : currentWeekIndex === weeksIndex ? 'bg-gray-300 dark:bg-gray-500' : ''"
        >
          <div class="text-xs mb-1">
            {{ `第${weeksIndex + 1}周` }}
          </div>
          <div class="h-10 grid grid-flow-col w-10 grid-cols-5 grid-rows-5">
            <template v-for="(weekWeekTimetable, weekWeekIndex) of weeksTimetable" :key="weekWeekIndex">
              <template v-if="weekWeekIndex < 5">
                <template v-for="(item, index) of weekWeekTimetable" :key="index">
                  <div
                    class="rounded-full mx-auto bg-gray-100 h-1.5 w-1.5"
                    :class="item ? '!bg-light-blue-500' : ''"
                  />
                </template>
              </template>
            </template>
          </div>
        </div>
      </div>
    </template>
  </scroll-view>
</template>
