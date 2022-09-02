<script setup lang="ts">
import type { CourseModel } from '~/stores/course'
import { weekTitle } from '~/stores/course'

const props = withDefaults(
  defineProps<{ showActionSheet: boolean; courseItem: CourseModel }>(), {
    showActionSheet: false,
    courseItem: undefined,
  },
)

const emit = defineEmits(['cancel'])

const courseStore = useCourseStore()

const courseList = computed(() => courseStore.getConflictCourse(props.courseItem))
const courseTime = computed(() => getCourseTime(courseList.value[0]))

function getCourseTime(item: CourseModel) {
  const { week, start, duration } = item
  return `星期${weekTitle[week - 1]} 第${start}-${start + duration - 1}节`
}

function navigateToDetail(courseItem: CourseModel) {
  closeActionSheet()
  uni.navigateTo({
    url: `/pages/detail/detail?course=${courseItem.title}`,
  })
}

function closeActionSheet() {
  emit('cancel')
}
</script>

<template>
  <div @touchmove.prevent>
    <div
      class="bg-base w-full min-h-10 transition-all ease-in-out z-100 duration-300 fixed"
      :class="showActionSheet && courseList?.length ? 'bottom-0' : '-bottom-full'"
    >
      <div class="flex flex-col py-6 gap-6">
        <div v-if="courseList?.length" class="font-medium text-xl px-4">
          {{ courseTime }}
        </div>
        <template v-for="(courseItem, index) of courseList" :key="index">
          <div
            class="flex flex-col px-4 gap-2"
            @click="navigateToDetail(courseItem)"
          >
            <div class="flex mb-1 w-full gap-2 justify-start items-center relative">
              <div
                class="rounded-full h-5 transition-background-color w-1 duration-300 inline-block"
                :class="[courseItem.color[0]]"
              />
              <div class="font-medium text-lg">
                {{ courseItem.title }}
              </div>
              <div
                class="text-xl top-0 right-4 bottom-0 z-20 absolute" :class="index ? 'i-carbon-up-to-top' : ''"
                @click.stop="courseStore.setCourseItemTop(courseItem)"
              />
            </div>
            <div class="flex gap-1 justify-start items-center">
              <div class="i-carbon-location" />
              {{ courseItem.location }}
            </div>
            <div class="flex gap-1 justify-start items-center">
              <div class="i-carbon-alarm" />
              {{ getCourseTime(courseItem) }}
            </div>
          </div>
        </template>
      </div>
      <div
        class="flex pb-safe h-12"
        text="center lg dark:!white"
        b="t-4 gray-200 dark:op-20" justify-center items-center
        hover-class="bg-gray-200 bg-opacity-50" :hover-stay-time="150" @click="closeActionSheet"
      >
        关闭
      </div>
    </div>
    <div
      class=" bg-dark-100 bg-opacity-50 transition-all top-0 right-0 bottom-0 left-0 z-90 fixed"
      :class="showActionSheet && courseList?.length ? 'opacity-100 visible' : 'opacity-0 invisible'"
      @click="closeActionSheet"
    />
  </div>
</template>
