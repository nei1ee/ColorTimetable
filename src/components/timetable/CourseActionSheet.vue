<script setup lang="ts">
import type { CourseModel } from '@/store/modules/course'
import { useCourseStore, weekTitle } from '@/store/modules/course'

const props = withDefaults(
  defineProps<{ showActionSheet: boolean; courseItem: CourseModel }>(), {
    showActionSheet: false,
    courseItem: undefined,
  },
)

const emit = defineEmits(['cancel'])

const courseStore = useCourseStore()

const courseList = computed(() => courseStore.getConflictCourse(props.courseItem))

function navigateToDetail(courseItem: CourseModel) {
  uni.navigateTo({
    url: `/pages/index/detail?course=${encodeURIComponent(JSON.stringify(courseItem))}`,
  })
}

function closeActionSheet() {
  emit('cancel')
}
</script>

<template>
  <div @touchmove.stop.prevent>
    <div
      class="bg-white w-full min-h-10 transition-all ease-in-out z-100 duration-300 fixed dark:bg-#121212"
      :class="showActionSheet && courseList?.length ? 'bottom-0' : '-bottom-full'"
    >
      <div class="flex flex-col py-6 gap-6">
        <div v-if="courseList?.length" class="font-medium text-xl px-4">
          {{ `星期${weekTitle[courseList[0].week - 1]} 第${courseList[0].start}-${courseList[0].start
            + courseList[0].duration - 1}节`
          }}
        </div>
        <template v-for="(courseItem, index) of courseList" :key="index">
          <div class="flex flex-col px-4 gap-2">
            <!-- @click="navigateToDetail(courseItem)" -->
            <div class="flex mb-1 w-full gap-2 justify-start items-center relative">
              <div
                class="rounded-full h-5 transition-background-color w-1 duration-300 inline-block"
                :style="[`background-color: ${courseItem.bgColor}`]"
              />
              <div class="font-medium text-lg">
                {{ courseItem.title }}
              </div>
              <div class="text-xl top-0 right-4 bottom-0 z-20 absolute" :class="index ? 'i-carbon-up-to-top' : ''" @click="courseStore.setCourseItemTop(courseItem)" />
            </div>
            <div class="flex gap-1 justify-start items-center">
              <div class="i-mdi-navigation-variant" />
              {{ courseItem.location }}
            </div>
            <div class="flex gap-1 justify-start items-center">
              <div class="i-mdi-clock" />
              {{ courseItem.time }}
            </div>
            <!-- <div class="flex justify-around items-center">
              <div
                :class="index ? 'i-carbon-up-to-top' : 'i-carbon-error'"
                @click="courseStore.setCourseItemTop(courseItem, index)"
              />
              <div class="i-carbon-edit" />
              <div class="i-carbon-delete" @click="handleDeleteCourseItem(courseItem, index)" />
            </div> -->
          </div>
        </template>
      </div>
      <div
        class="flex pb-safe border-t-4 border-gray-200 h-12 text-center text-lg justify-center items-center dark:border-opacity-20"
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

<style scoped>
</style>
